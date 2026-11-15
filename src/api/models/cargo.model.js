const db = require('../../../config/database');

class CargoRepository {
    async findAll() {
        const [rows] = await db.query(`
            SELECT c.id, c.numero_puesto, c.tipo_cargo, c.total_horas, c.estado,
                   -- Docente activo asignado (titular o suplente)
                   (SELECT CONCAT(d.apellido, ' ', d.nombre)
                    FROM cargo_docente cd2
                    JOIN docentes d ON cd2.docente_id = d.id
                    WHERE cd2.cargo_id = c.id 
                      AND cd2.estado = 'activo' 
                      AND cd2.deleted_at IS NULL
                    ORDER BY cd2.fecha_inicio DESC
                    LIMIT 1) AS docente_nombre,
                   -- Si no hay docente activo, obtener el docente en licencia
                   (SELECT CONCAT(d.apellido, ' ', d.nombre)
                    FROM cargo_docente cd3
                    JOIN docentes d ON cd3.docente_id = d.id
                    WHERE cd3.cargo_id = c.id 
                      AND cd3.estado = 'licencia' 
                      AND cd3.deleted_at IS NULL
                    ORDER BY cd3.fecha_inicio DESC
                    LIMIT 1) AS docente_licencia_nombre,
                   -- Situación de revista del docente asignado
                   (SELECT cd4.situacion_revista
                    FROM cargo_docente cd4
                    WHERE cd4.cargo_id = c.id 
                      AND cd4.estado IN ('activo', 'licencia')
                      AND cd4.deleted_at IS NULL
                    ORDER BY CASE WHEN cd4.estado = 'activo' THEN 1 ELSE 2 END, cd4.fecha_inicio DESC
                    LIMIT 1) AS situacion_revista,
                   -- Estado en cargo_docente ('activo', 'licencia')
                   (SELECT cd5.estado
                    FROM cargo_docente cd5
                    WHERE cd5.cargo_id = c.id 
                      AND cd5.estado IN ('activo', 'licencia')
                      AND cd5.deleted_at IS NULL
                    ORDER BY CASE WHEN cd5.estado = 'activo' THEN 1 ELSE 2 END, cd5.fecha_inicio DESC
                    LIMIT 1) AS docente_estado,
                   -- Tipo de licencia activa o pendiente para el puesto
                   (SELECT l.tipo_licencia
                    FROM licencias l
                    JOIN cargo_docente cd6 ON cd6.docente_id = l.docente_id AND cd6.cargo_id = c.id AND cd6.deleted_at IS NULL
                    WHERE l.deleted_at IS NULL
                      AND (l.cargo_id IS NULL OR l.cargo_id = c.id)
                      AND (l.fecha_fin IS NULL OR l.fecha_fin >= CURDATE())
                    ORDER BY l.fecha_inicio DESC
                    LIMIT 1) AS licencia_activa,
                   -- Estado del trámite de licencia (caratulado, en_tramitacion, realizado)
                   (SELECT t.estado
                    FROM licencias l2
                    JOIN tramitaciones t ON l2.tramitacion_id = t.id
                    JOIN cargo_docente cd7 ON cd7.docente_id = l2.docente_id AND cd7.cargo_id = c.id AND cd7.deleted_at IS NULL
                    WHERE l2.deleted_at IS NULL
                      AND (l2.cargo_id IS NULL OR l2.cargo_id = c.id)
                      AND (l2.fecha_fin IS NULL OR l2.fecha_fin >= CURDATE())
                    ORDER BY l2.fecha_inicio DESC
                    LIMIT 1) AS tramite_estado
            FROM cargos c
            WHERE c.deleted_at IS NULL
        `);
        return rows;
    }

    async findById(id) {
        const [rows] = await db.query(
            "SELECT * FROM cargos WHERE id = ? AND deleted_at IS NULL",
            [id]
        );
        return rows[0];
    }

    async findByNumeroPuesto(numero_puesto, excludeId = null) {
        let sql = "SELECT id FROM cargos WHERE numero_puesto = ? AND deleted_at IS NULL";
        const params = [numero_puesto];
        
        if (excludeId) {
            sql += " AND id != ?";
            params.push(excludeId);
        }

        const [rows] = await db.query(sql, params);
        return rows[0];
    }

    async create(data) {
        const { numero_puesto, tipo_cargo, total_horas } = data;
        const [result] = await db.query(`
            INSERT INTO cargos (numero_puesto, tipo_cargo, total_horas, estado, created_at)
            VALUES (?, ?, ?, 'activo', NOW())
        `, [numero_puesto, tipo_cargo, total_horas || null]);
        return result.insertId;
    }

    async update(id, data) {
        const { numero_puesto, tipo_cargo, total_horas, estado } = data;
        await db.query(`
            UPDATE cargos SET 
            numero_puesto=?, tipo_cargo=?, total_horas=?, estado=?, updated_at=NOW()
            WHERE id=? AND deleted_at IS NULL
        `, [numero_puesto, tipo_cargo, total_horas || null, estado || 'activo', id]);
    }

    async delete(id, userId) {
        await db.query(
            "UPDATE cargos SET deleted_at=NOW(), deleted_by=?, estado='inactivo' WHERE id=?",
            [userId, id]
        );
    }

    async findActiveAssignments(cargoId) {
        const [rows] = await db.query(
            "SELECT id, situacion_revista FROM cargo_docente WHERE cargo_id = ? AND estado = 'activo' AND deleted_at IS NULL",
            [cargoId]
        );
        return rows;
    }

    async updateAssignmentState(id, newState, fechaFin = null) {
        let sql = "UPDATE cargo_docente SET estado = ?";
        const params = [newState];

        if (fechaFin) {
            sql += ", fecha_fin = ?";
            params.push(fechaFin);
        }

        sql += " WHERE id = ? AND deleted_at IS NULL";
        params.push(id);

        await db.query(sql, params);
    }

    async inactivatePrevious(cargoId, situations, fechaFin = null) {
        const sql = `
            UPDATE cargo_docente
            SET estado = 'inactivo', fecha_fin = ?
            WHERE cargo_id = ? AND situacion_revista IN (?) AND deleted_at IS NULL AND estado = 'activo'
        `;
        await db.query(sql, [fechaFin, cargoId, situations]);
    }

    async assignDocente(docenteData) {
        const { docente_id, cargo_id, situacion_revista, fecha_inicio, reemplaza_a, rol, expediente_alta } = docenteData;
        const sql = `
            INSERT INTO cargo_docente (docente_id, cargo_id, situacion_revista, fecha_inicio, reemplaza_a, estado, created_at, rol, expediente_alta)
            VALUES (?, ?, ?, ${fecha_inicio ? '?' : 'CURDATE()'}, ?, 'activo', NOW(), ?, ?)
        `;

        const params = [docente_id, cargo_id, situacion_revista || 'interino'];
        if (fecha_inicio) {params.push(fecha_inicio);}
        params.push(reemplaza_a || null);
        params.push(rol || 0);
        params.push(expediente_alta || null);

        const [result] = await db.query(sql, params);
        return result.insertId;
    }

    async findAssignmentById(id) {
        const [rows] = await db.query(
            "SELECT * FROM cargo_docente WHERE id = ? AND deleted_at IS NULL",
            [id]
        );
        return rows[0];
    }

    async bajaDocente(cargoDocenteId, data) {
        const { fecha_fin, expediente_baja } = data;
        const sql = `
            UPDATE cargo_docente 
            SET estado = 'inactivo', 
                fecha_fin = ${fecha_fin ? '?' : 'CURDATE()'}, 
                expediente_baja = ?, 
                updated_at = NOW()
            WHERE id = ? AND deleted_at IS NULL
        `;
        const params = [];
        if (fecha_fin) {params.push(fecha_fin);}
        params.push(expediente_baja || null);
        params.push(cargoDocenteId);

        await db.query(sql, params);
    }

    async getHistorial(id) {
        const [rows] = await db.query(`
            SELECT cd.*, 
                   CONCAT(d.apellido, ' ', d.nombre) AS docente_nombre,
                   CONCAT(d2.apellido, ' ', d2.nombre) AS reemplaza_nombre
            FROM cargo_docente cd
            LEFT JOIN docentes d ON cd.docente_id = d.id
            LEFT JOIN cargo_docente cd2 ON cd.reemplaza_a = cd2.id
            LEFT JOIN docentes d2 ON cd2.docente_id = d2.id
            WHERE cd.cargo_id = ? AND cd.deleted_at IS NULL
            ORDER BY CASE 
                WHEN cd.estado = 'activo' THEN 1 
                WHEN cd.estado = 'licencia' THEN 2 
                ELSE 3 
            END, cd.fecha_inicio DESC, cd.created_at DESC
        `, [id]);
        return rows;
    }

    async getDistribucion(cargoId) {
        const [rows] = await db.query(`
            SELECT dh.*, m.nombre AS materia_nombre,
                   th.nombre AS tipo_hora_nombre,
                   cur.anio AS curso_anio, cur.division AS curso_division, 
                   cur.modalidad AS curso_modalidad, cur.especialidad AS curso_especialidad,
                   cur.turno AS curso_turno
            FROM distribucion_horas dh
            JOIN materias m ON dh.materia_id = m.id
            LEFT JOIN cursos cur ON dh.curso_id = cur.id
            LEFT JOIN tipos_hora th ON dh.tipo_hora_id = th.id
            WHERE dh.cargo_id = ? AND dh.deleted_at IS NULL
            ORDER BY FIELD(dh.dia, 'lunes', 'martes', 'miércoles', 'jueves', 'viernes'), dh.hora_ingreso
        `, [cargoId]);
        return rows;
    }

    async addDistribucion(data) {
        const { cargo_id, materia_id, curso_id, cantidad_horas, dia, hora_ingreso, hora_egreso, tipo_hora_id } = data;
        const [result] = await db.query(`
            INSERT INTO distribucion_horas 
            (cargo_id, materia_id, curso_id, cantidad_horas, dia, hora_ingreso, hora_egreso, tipo_hora_id, created_at, tipo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'materia')
        `, [cargo_id, materia_id, curso_id, cantidad_horas, dia, hora_ingreso, hora_egreso, tipo_hora_id || null]);
        return result.insertId;
    }

    async updateDistribucion(id, data) {
        const { materia_id, curso_id, cantidad_horas, dia, hora_ingreso, hora_egreso, tipo_hora_id } = data;
        await db.query(`
            UPDATE distribucion_horas 
            SET materia_id=?, curso_id=?, cantidad_horas=?, dia=?, 
                hora_ingreso=?, hora_egreso=?, tipo_hora_id=?, updated_at=NOW()
            WHERE id=? AND deleted_at IS NULL
        `, [materia_id, curso_id, cantidad_horas, dia, hora_ingreso, hora_egreso, tipo_hora_id || null, id]);
    }

    async deleteDistribucion(id) {
        await db.query(
            "UPDATE distribucion_horas SET deleted_at=NOW() WHERE id=?",
            [id]
        );
    }

    // --- Tipos de Hora ---
    async findTiposHora() {
        const [rows] = await db.query("SELECT * FROM tipos_hora WHERE deleted_at IS NULL ORDER BY nombre ASC");
        return rows;
    }

    async createTipoHora(nombre, descripcion) {
        await db.query("INSERT INTO tipos_hora (nombre, descripcion) VALUES (?, ?)", [nombre, descripcion]);
    }

    // --- Cadena de Asignaciones ---
    async findActiveChain(cargoId) {
        // Obtenemos todos los que no tienen fecha de baja definitiva
        const [rows] = await db.query(`
            SELECT cd.*, 
                   CONCAT(d.apellido, ' ', d.nombre) AS docente_nombre,
                   d.dni AS docente_dni,
                   l.tipo_licencia AS licencia_actual,
                   l.id AS licencia_id,
                   t.estado AS tramite_estado
            FROM cargo_docente cd
            JOIN docentes d ON cd.docente_id = d.id
            LEFT JOIN licencias l ON d.id = l.docente_id 
                 AND (l.cargo_id IS NULL OR l.cargo_id = cd.cargo_id)
                 AND l.deleted_at IS NULL AND l.fecha_inicio <= CURDATE() 
                 AND (l.fecha_fin IS NULL OR l.fecha_fin >= CURDATE())
            LEFT JOIN tramitaciones t ON l.tramitacion_id = t.id
            WHERE cd.cargo_id = ? AND cd.estado IN ('activo', 'licencia') AND cd.deleted_at IS NULL
            ORDER BY cd.fecha_inicio ASC
        `, [cargoId]);

        return rows;
    }
}

module.exports = new CargoRepository();
