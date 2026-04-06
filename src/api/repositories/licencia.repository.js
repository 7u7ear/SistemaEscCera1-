const db = require('../../../config/database');

class LicenciaRepository {
    async findAll() {
        const [rows] = await db.query(`
            SELECT l.*, 
                   CONCAT(d.apellido, ' ', d.nombre) AS docente_nombre,
                   c.numero_puesto, c.tipo_cargo,
                   t.estado AS tramite_estado, t.id AS tramite_id
            FROM licencias l
            JOIN docentes d ON l.docente_id = d.id
            LEFT JOIN cargos c ON l.cargo_id = c.id
            LEFT JOIN tramitaciones t ON l.tramitacion_id = t.id
            WHERE l.deleted_at IS NULL
            ORDER BY l.fecha_inicio DESC
        `);
        return rows;
    }

    async findById(id) {
        const [rows] = await db.query(
            "SELECT * FROM licencias WHERE id = ? AND deleted_at IS NULL",
            [id]
        );
        return rows[0];
    }

    async create(data) {
        const { docente_id, cargo_id, tramitacion_id, fecha_inicio, fecha_fin, tipo_licencia, corresponde_expediente, expediente, observaciones } = data;
        const [result] = await db.query(`
            INSERT INTO licencias (docente_id, cargo_id, tramitacion_id, fecha_inicio, fecha_fin, tipo_licencia, corresponde_expediente, expediente, observaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [docente_id, cargo_id, tramitacion_id, fecha_inicio, fecha_fin || null, tipo_licencia, corresponde_expediente ? 1 : 0, expediente || null, observaciones || null]);
        return result.insertId;
    }

    async update(id, data) {
        const { fecha_inicio, fecha_fin, tipo_licencia, corresponde_expediente, expediente, observaciones } = data;
        await db.query(`
            UPDATE licencias 
            SET fecha_inicio = ?, fecha_fin = ?, tipo_licencia = ?, corresponde_expediente = ?, expediente = ?, observaciones = ?
            WHERE id = ?
        `, [fecha_inicio, fecha_fin || null, tipo_licencia, corresponde_expediente ? 1 : 0, expediente || null, observaciones || null, id]);
    }

    async delete(id) {
        await db.query("UPDATE licencias SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", [id]);
    }

    async findTipos() {
        const [rows] = await db.query("SELECT * FROM cod_lic WHERE activo = 1 ORDER BY cod_licencia");
        return rows;
    }

    async createTipo(cod_licencia, descripcion) {
        await db.query("INSERT INTO cod_lic (cod_licencia, descripcion) VALUES (?, ?)", [cod_licencia, descripcion]);
    }

    async updateCargoDocenteState(cargoId, docenteId, fromState, toState) {
        await db.query(`
            UPDATE cargo_docente 
            SET estado = ? 
            WHERE cargo_id = ? AND docente_id = ? AND estado = ? AND deleted_at IS NULL
        `, [toState, cargoId, docenteId, fromState]);
    }
}

module.exports = new LicenciaRepository();
