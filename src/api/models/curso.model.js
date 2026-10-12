const db = require('../../../config/database');

class CursoRepository {
    async findAll() {
        const [rows] = await db.query("SELECT * FROM cursos ORDER BY anio, division ASC");
        return rows;
    }

    async findById(id) {
        const [rows] = await db.query("SELECT * FROM cursos WHERE id = ?", [id]);
        return rows[0] || null;
    }

    async getPreceptoresByCurso(curso_id, anio_lectivo) {
        const [rows] = await db.query(`
            SELECT d.id, d.nombre, d.apellido, d.email, d.telefono,
                   GROUP_CONCAT(DISTINCT c.tipo_cargo SEPARATOR ', ') AS cargo_tipo
            FROM curso_preceptor cp
            JOIN docentes d ON cp.docente_id = d.id
            LEFT JOIN cargo_docente cd ON cd.docente_id = d.id AND cd.estado = 'activo' AND cd.deleted_at IS NULL
            LEFT JOIN cargos c ON cd.cargo_id = c.id AND c.deleted_at IS NULL
            WHERE cp.curso_id = ? AND cp.anio_lectivo = ? AND d.deleted_at IS NULL
            GROUP BY d.id, d.nombre, d.apellido, d.email, d.telefono
            ORDER BY d.apellido, d.nombre
        `, [curso_id, anio_lectivo]);
        return rows;
    }

    async getPreceptorByCurso(curso_id, anio_lectivo) {
        const rows = await this.getPreceptoresByCurso(curso_id, anio_lectivo);
        return rows[0] || null;
    }

    async assignPreceptores(curso_id, docente_ids, anio_lectivo) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.query(`
                DELETE FROM curso_preceptor 
                WHERE curso_id = ? AND anio_lectivo = ?
            `, [curso_id, anio_lectivo]);

            if (Array.isArray(docente_ids) && docente_ids.length > 0) {
                const values = docente_ids.map(docId => [curso_id, docId, anio_lectivo]);
                await connection.query(`
                    INSERT INTO curso_preceptor (curso_id, docente_id, anio_lectivo)
                    VALUES ?
                `, [values]);
            }

            await connection.commit();
            return { count: docente_ids ? docente_ids.length : 0 };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async assignPreceptor(curso_id, docente_id, anio_lectivo) {
        const ids = Array.isArray(docente_id) ? docente_id : (docente_id ? [docente_id] : []);
        return await this.assignPreceptores(curso_id, ids, anio_lectivo);
    }

    async getEstudiantesByCurso(curso_id, anio_lectivo) {
        const [rows] = await db.query(`
            SELECT a.id, a.apellido, a.nombre, a.dni, a.email, a.direccion, i.anio_lectivo
            FROM inscripciones i
            JOIN alumnos a ON i.alumno_id = a.id
            WHERE i.curso_id = ? AND i.anio_lectivo = ? AND a.deleted_at IS NULL
            ORDER BY a.apellido ASC, a.nombre ASC
        `, [curso_id, anio_lectivo]);
        return rows;
    }

    async getTutoresByCurso(curso_id, anio_lectivo) {
        const [rows] = await db.query(`
            SELECT f.id, f.nombre, f.apellido, f.dni, f.telefono, f.email, f.parentesco,
                   a.id AS alumno_id, a.nombre AS alumno_nombre, a.apellido AS alumno_apellido, a.dni AS alumno_dni
            FROM inscripciones i
            JOIN alumnos a ON i.alumno_id = a.id
            JOIN familiares f ON f.alumno_id = a.id
            WHERE i.curso_id = ? AND i.anio_lectivo = ? AND a.deleted_at IS NULL
            ORDER BY a.apellido ASC, a.nombre ASC, f.apellido ASC, f.nombre ASC
        `, [curso_id, anio_lectivo]);
        return rows;
    }

    async getDocentesMateriasByCurso(curso_id) {
        const [rows] = await db.query(`
            SELECT DISTINCT
                dh.cargo_id,
                dh.materia_id,
                m.nombre AS materia_nombre,
                c.numero_puesto,
                cd.situacion_revista,
                d.id AS docente_id,
                d.nombre AS docente_nombre,
                d.apellido AS docente_apellido,
                d.email AS docente_email,
                d.telefono AS docente_telefono
            FROM distribucion_horas dh
            JOIN materias m ON dh.materia_id = m.id
            LEFT JOIN cargos c ON dh.cargo_id = c.id
            LEFT JOIN cargo_docente cd ON cd.cargo_id = dh.cargo_id 
                AND cd.estado = 'activo' 
                AND cd.deleted_at IS NULL
            LEFT JOIN docentes d ON cd.docente_id = d.id 
                AND d.deleted_at IS NULL
            WHERE dh.curso_id = ? 
              AND dh.deleted_at IS NULL
            ORDER BY m.nombre ASC, cd.fecha_inicio DESC
        `, [curso_id]);
        return rows;
    }
}

module.exports = new CursoRepository();

