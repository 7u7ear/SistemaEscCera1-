const db = require('../../../config/database');
const AppError = require('../../shared/errors/AppError');
const AuditoriaService = require('./auditoria.service');
const logger = require('./logger.service');

class AlumnoService {
    async getAllAlumnos() {
        const [rows] = await db.query(`
            SELECT a.*, 
                   (SELECT CONCAT(
                       c.anio, '°', COALESCE(c.division, ''),
                       IF(c.especialidad IS NOT NULL AND c.especialidad != '', CONCAT(' ', c.especialidad), ''),
                       IF(c.modalidad IS NOT NULL AND c.modalidad != '', CONCAT(' - ', c.modalidad), ''),
                       IF(c.turno IS NOT NULL AND c.turno != '', CONCAT(' (', UPPER(c.turno), ')'), '')
                    )
                    FROM inscripciones i
                    JOIN cursos c ON i.curso_id = c.id
                    WHERE i.alumno_id = a.id
                    ORDER BY i.anio_lectivo DESC LIMIT 1) as curso_actual
            FROM alumnos a
            ORDER BY a.apellido ASC, a.nombre ASC
        `);
        return rows;
    }

    async getAlumnoById(id) {
        const [alumnos] = await db.query("SELECT * FROM alumnos WHERE id = ?", [id]);
        if (alumnos.length === 0) {
            throw new AppError('Alumno no encontrado', 404);
        }
        const alumno = alumnos[0];

        // Obtener familiares
        const [familiares] = await db.query("SELECT * FROM familiares WHERE alumno_id = ?", [id]);
        alumno.familiares = familiares;

        // Obtener historial de inscripciones
        const [inscripciones] = await db.query(`
            SELECT i.*, c.anio, c.division, c.turno, c.modalidad, c.especialidad
            FROM inscripciones i
            JOIN cursos c ON i.curso_id = c.id
            WHERE i.alumno_id = ?
            ORDER BY i.anio_lectivo DESC
        `, [id]);
        alumno.inscripciones = inscripciones;

        // Obtener materias adeudadas
        const [materias] = await db.query(`
            SELECT ma.*, m.nombre as materia_nombre
            FROM materias_adeudadas ma
            JOIN materias m ON ma.materia_id = m.id
            WHERE ma.alumno_id = ?
        `, [id]);
        alumno.materias_adeudadas = materias;

        return alumno;
    }

    async createAlumno(data, userId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Verificar DNI
            const [existing] = await connection.query("SELECT id FROM alumnos WHERE dni = ?", [data.dni]);
            if (existing.length > 0) {
                throw new AppError('Ya existe un alumno con ese DNI', 400);
            }

            // Insertar alumno
            const [result] = await connection.query(
                `INSERT INTO alumnos (apellido, nombre, dni, fecha_nacimiento, direccion, email, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                [data.apellido, data.nombre, data.dni, data.fecha_nacimiento, data.direccion || null, data.email || null]
            );
            const alumnoId = result.insertId;

            // Insertar familiares si vienen especificados
            const listaFamiliares = Array.isArray(data.familiares) 
                ? data.familiares 
                : (data.familiar && data.familiar.dni ? [data.familiar] : []);

            for (const fam of listaFamiliares) {
                if (fam.dni && fam.nombre && fam.apellido) {
                    await connection.query(
                        `INSERT INTO familiares (nombre, apellido, dni, telefono, email, parentesco, alumno_id, created_at, updated_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                        [
                            fam.nombre,
                            fam.apellido,
                            fam.dni,
                            fam.telefono || null,
                            fam.email || null,
                            fam.parentesco || null,
                            alumnoId
                        ]
                    );
                }
            }

            // Registrar movimiento inicial
            await connection.query(
                `INSERT INTO alumno_movimientos (alumno_id, tipo_movimiento, fecha, detalle, usuario_id)
                 VALUES (?, 'alta', CURDATE(), ?, ?)`,
                [alumnoId, JSON.stringify({ detalle: 'Alta de alumno en el sistema' }), userId]
            );

            await connection.commit();
            await AuditoriaService.registrar(userId, 'CREATE', 'ALUMNOS', alumnoId, { dni: data.dni, apellido: data.apellido });
            return alumnoId;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    async updateAlumno(id, data, userId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const [existing] = await connection.query("SELECT id FROM alumnos WHERE dni = ? AND id <> ?", [data.dni, id]);
            if (existing.length > 0) {
                throw new AppError('Otro alumno ya posee ese DNI', 400);
            }

            await connection.query(
                `UPDATE alumnos 
                 SET apellido = ?, nombre = ?, dni = ?, fecha_nacimiento = ?, direccion = ?, email = ?, updated_at = NOW() 
                 WHERE id = ?`,
                [data.apellido, data.nombre, data.dni, data.fecha_nacimiento, data.direccion || null, data.email || null, id]
            );

            // Si se pasa la lista de familiares, sincronizarla
            if (Array.isArray(data.familiares)) {
                await connection.query("DELETE FROM familiares WHERE alumno_id = ?", [id]);
                for (const fam of data.familiares) {
                    if (fam.dni && fam.nombre && fam.apellido) {
                        await connection.query(
                            `INSERT INTO familiares (nombre, apellido, dni, telefono, email, parentesco, alumno_id, created_at, updated_at)
                             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
                            [
                                fam.nombre,
                                fam.apellido,
                                fam.dni,
                                fam.telefono || null,
                                fam.email || null,
                                fam.parentesco || null,
                                id
                            ]
                        );
                    }
                }
            }

            await connection.commit();
            await AuditoriaService.registrar(userId, 'UPDATE', 'ALUMNOS', id, { dni: data.dni });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    async deleteAlumno(id, userId) {
        const [alumnos] = await db.query("SELECT id, dni FROM alumnos WHERE id = ?", [id]);
        if (alumnos.length === 0) throw new AppError('Alumno no encontrado', 404);

        await db.query("DELETE FROM alumnos WHERE id = ?", [id]);
        await AuditoriaService.registrar(userId, 'DELETE', 'ALUMNOS', id, { dni: alumnos[0].dni });
    }

    async matricularAlumno(data, userId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const { alumno_id, curso_id, anio_lectivo } = data;

            // Verificar si ya está matriculado este año
            const [inscrito] = await connection.query(
                "SELECT id FROM inscripciones WHERE alumno_id = ? AND anio_lectivo = ?",
                [alumno_id, anio_lectivo]
            );
            if (inscrito.length > 0) {
                throw new AppError(`El alumno ya se encuentra matriculado en un curso para el ciclo lectivo ${anio_lectivo}`, 400);
            }

            // Insertar inscripción
            const [result] = await connection.query(
                `INSERT INTO inscripciones (alumno_id, curso_id, anio_lectivo, created_at, updated_at) 
                 VALUES (?, ?, ?, NOW(), NOW())`,
                [alumno_id, curso_id, anio_lectivo]
            );
            const inscripcionId = result.insertId;

            // Obtener info del curso para el detalle
            const [cursos] = await connection.query(
                "SELECT CONCAT(anio, '°', COALESCE(division, '')) as nombre FROM cursos WHERE id = ?",
                [curso_id]
            );
            const cursoNombre = cursos.length > 0 ? cursos[0].nombre : 'Desconocido';

            // Guardar movimiento
            await connection.query(
                `INSERT INTO alumno_movimientos (alumno_id, tipo_movimiento, fecha, detalle, usuario_id)
                 VALUES (?, 'matriculacion', CURDATE(), ?, ?)`,
                [alumno_id, JSON.stringify({ curso_id, curso_nombre: cursoNombre, anio_lectivo }), userId]
            );

            await connection.commit();
            await AuditoriaService.registrar(userId, 'MATRICULAR', 'ALUMNOS', alumno_id, { curso_id, anio_lectivo });
            return inscripcionId;
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    async trasladarAlumno(data, userId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const { alumno_id, curso_origen_id, curso_destino_id, anio_lectivo } = data;

            // Obtener nombres de los cursos
            const [origenRows] = await connection.query("SELECT CONCAT(anio, '°', COALESCE(division, '')) as nombre FROM cursos WHERE id = ?", [curso_origen_id]);
            const [destinoRows] = await connection.query("SELECT CONCAT(anio, '°', COALESCE(division, '')) as nombre FROM cursos WHERE id = ?", [curso_destino_id]);

            const cursoOrigenNombre = origenRows.length > 0 ? origenRows[0].nombre : 'Ninguno';
            const cursoDestinoNombre = destinoRows.length > 0 ? destinoRows[0].nombre : 'Desconocido';

            if (curso_origen_id) {
                // Actualizar la inscripción existente para este año lectivo
                await connection.query(
                    "UPDATE inscripciones SET curso_id = ?, updated_at = NOW() WHERE alumno_id = ? AND anio_lectivo = ?",
                    [curso_destino_id, alumno_id, anio_lectivo]
                );
            } else {
                // Si no tiene inscripción previa para este año, crearla directamente
                await connection.query(
                    `INSERT INTO inscripciones (alumno_id, curso_id, anio_lectivo, created_at, updated_at) 
                     VALUES (?, ?, ?, NOW(), NOW())`,
                    [alumno_id, curso_destino_id, anio_lectivo]
                );
            }

            // Registrar movimiento de traslado/pase
            await connection.query(
                `INSERT INTO alumno_movimientos (alumno_id, tipo_movimiento, fecha, detalle, usuario_id)
                 VALUES (?, 'pase_curso', CURDATE(), ?, ?)`,
                [alumno_id, JSON.stringify({ curso_origen_id, curso_origen_nombre: cursoOrigenNombre, curso_destino_id, curso_destino_nombre: cursoDestinoNombre, anio_lectivo }), userId]
            );

            await connection.commit();
            await AuditoriaService.registrar(userId, 'TRASLADO_CURSO', 'ALUMNOS', alumno_id, { curso_origen_id, curso_destino_id, anio_lectivo });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    async desinscribirAlumno(alumnoId, cursoId, anioLectivo, userId) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const [cursos] = await connection.query("SELECT CONCAT(anio, '°', COALESCE(division, '')) as nombre FROM cursos WHERE id = ?", [cursoId]);
            const cursoNombre = cursos.length > 0 ? cursos[0].nombre : 'Desconocido';

            await connection.query(
                "DELETE FROM inscripciones WHERE alumno_id = ? AND curso_id = ? AND anio_lectivo = ?",
                [alumnoId, cursoId, anioLectivo]
            );

            await connection.query(
                `INSERT INTO alumno_movimientos (alumno_id, tipo_movimiento, fecha, detalle, usuario_id)
                 VALUES (?, 'baja_inscripcion', CURDATE(), ?, ?)`,
                [alumnoId, JSON.stringify({ curso_id: cursoId, curso_nombre: cursoNombre, anio_lectivo: anioLectivo }), userId]
            );

            await connection.commit();
            await AuditoriaService.registrar(userId, 'BAJA_MATRICULA', 'ALUMNOS', alumnoId, { curso_id: cursoId, anio_lectivo: anioLectivo });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    }

    async getMovimientos(alumnoId) {
        const [rows] = await db.query(`
            SELECT am.*, u.nombre as usuario_nombre
            FROM alumno_movimientos am
            LEFT JOIN usuarios u ON am.usuario_id = u.id
            WHERE am.alumno_id = ?
            ORDER BY am.created_at DESC
        `, [alumnoId]);
        return rows;
    }

    async getAlumnosPorCurso(cursoId, anioLectivo) {
        const [rows] = await db.query(`
            SELECT a.id, a.apellido, a.nombre, a.dni, a.email, a.fecha_nacimiento, i.anio_lectivo
            FROM inscripciones i
            JOIN alumnos a ON i.alumno_id = a.id
            WHERE i.curso_id = ? AND i.anio_lectivo = ?
            ORDER BY a.apellido ASC, a.nombre ASC
        `, [cursoId, anioLectivo]);
        return rows;
    }

    // --- Materias Adeudadas ---
    async getMateriasAdeudadas(alumnoId) {
        const [rows] = await db.query(`
            SELECT ma.*, m.nombre as materia_nombre
            FROM materias_adeudadas ma
            JOIN materias m ON ma.materia_id = m.id
            WHERE ma.alumno_id = ?
        `, [alumnoId]);
        return rows;
    }

    async createMateriaAdeudada(data, userId) {
        const [existing] = await db.query(
            "SELECT id FROM materias_adeudadas WHERE alumno_id = ? AND materia_id = ? AND estado = 'pendiente'",
            [data.alumno_id, data.materia_id]
        );
        if (existing.length > 0) {
            throw new AppError('El alumno ya tiene esta materia adeudada registrada como pendiente', 400);
        }

        const [result] = await db.query(
            `INSERT INTO materias_adeudadas (alumno_id, materia_id, estado, created_at, updated_at) 
             VALUES (?, ?, ?, NOW(), NOW())`,
            [data.alumno_id, data.materia_id, data.estado || 'pendiente']
        );

        await AuditoriaService.registrar(userId, 'CREATE_MATERIA_ADEUDADA', 'ALUMNOS', data.alumno_id, { materia_id: data.materia_id });
        return result.insertId;
    }

    async updateMateriaAdeudada(id, estado, userId) {
        const [rows] = await db.query("SELECT alumno_id, materia_id FROM materias_adeudadas WHERE id = ?", [id]);
        if (rows.length === 0) throw new AppError('Registro no encontrado', 404);

        await db.query(
            "UPDATE materias_adeudadas SET estado = ?, updated_at = NOW() WHERE id = ?",
            [estado, id]
        );

        await AuditoriaService.registrar(userId, 'UPDATE_MATERIA_ADEUDADA', 'ALUMNOS', rows[0].alumno_id, { materia_id: rows[0].materia_id, nuevo_estado: estado });
    }

    async deleteMateriaAdeudada(id, userId) {
        const [rows] = await db.query("SELECT alumno_id, materia_id FROM materias_adeudadas WHERE id = ?", [id]);
        if (rows.length === 0) throw new AppError('Registro no encontrado', 404);

        await db.query("DELETE FROM materias_adeudadas WHERE id = ?", [id]);
        await AuditoriaService.registrar(userId, 'DELETE_MATERIA_ADEUDADA', 'ALUMNOS', rows[0].alumno_id, { materia_id: rows[0].materia_id });
    }
}

module.exports = new AlumnoService();
