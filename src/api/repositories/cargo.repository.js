const db = require('../../../config/database');

class CargoRepository {
    async findAll() {
        const [rows] = await db.query(`
            SELECT c.id, c.numero_puesto, c.tipo_cargo, c.total_horas, c.estado,
                   CONCAT(d.apellido, ' ', d.nombre) AS docente_nombre
            FROM cargos c
            LEFT JOIN cargo_docente cd ON c.id = cd.cargo_id AND cd.deleted_at IS NULL
            LEFT JOIN docentes d ON cd.docente_id = d.id AND d.deleted_at IS NULL
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
        if (fecha_inicio) params.push(fecha_inicio);
        params.push(reemplaza_a || null);
        params.push(rol || 0);
        params.push(expediente_alta || null);

        const [result] = await db.query(sql, params);
        return result.insertId;
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
                   l.tipo_licencia AS licencia_actual
            FROM cargo_docente cd
            JOIN docentes d ON cd.docente_id = d.id
            LEFT JOIN licencias l ON d.id = l.docente_id AND cd.cargo_id = l.cargo_id 
                 AND l.deleted_at IS NULL AND l.fecha_inicio <= CURDATE() 
                 AND (l.fecha_fin IS NULL OR l.fecha_fin >= CURDATE())
            WHERE cd.cargo_id = ? AND cd.estado IN ('activo', 'licencia') AND cd.deleted_at IS NULL
            ORDER BY cd.fecha_inicio ASC
        `, [cargoId]);

        // Reorganizar jerárquicamente en el servicio si fuera necesario, 
        // pero con esta lista plana ordenada por fecha de inicio el frontend ya puede trabajar.
        return rows;
    }
}

module.exports = new CargoRepository();
