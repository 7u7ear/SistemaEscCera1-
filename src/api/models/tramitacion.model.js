const db = require('../../../config/database');

class TramitacionRepository {
    async findAll() {
        const [rows] = await db.query(`
            SELECT t.*, 
                   CONCAT(d.apellido, ' ', d.nombre) AS docente_nombre,
                   ct.codigo AS tramite_codigo, ct.descripcion_tramite AS tramite_descripcion,
                   c.numero_puesto, c.tipo_cargo, c.id AS cargo_id
            FROM tramitaciones t
            LEFT JOIN docentes d ON t.docente_id = d.id
            LEFT JOIN codigo_tramites ct ON t.codigo_tramite_id = ct.id
            LEFT JOIN cargos c ON t.cargo_id = c.id
            WHERE t.deleted_at IS NULL
            ORDER BY t.fecha DESC
        `);
        return rows;
    }

    async findById(id) {
        const [rows] = await db.query("SELECT * FROM tramitaciones WHERE id = ? AND deleted_at IS NULL", [id]);
        return rows[0];
    }

    async create(data) {
        const { fecha, docente_id, rol, expediente, cargo_id, codigo_tramite_id, estado, observaciones, created_by } = data;
        const [result] = await db.query(`
            INSERT INTO tramitaciones (fecha, docente_id, rol, expediente, cargo_id, codigo_tramite_id, estado, observaciones, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [fecha || null, docente_id || null, rol || null, expediente || null, cargo_id || null, codigo_tramite_id || null, estado || 'caratulado', observaciones || null, created_by]);
        return result.insertId;
    }

    async update(id, data) {
        const { fecha, docente_id, rol, expediente, cargo_id, codigo_tramite_id, estado, observaciones } = data;
        await db.query(`
            UPDATE tramitaciones 
            SET fecha = ?, docente_id = ?, rol = ?, expediente = ?, cargo_id = ?, codigo_tramite_id = ?, estado = ?, observaciones = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND deleted_at IS NULL
        `, [fecha || null, docente_id || null, rol || null, expediente || null, cargo_id || null, codigo_tramite_id || null, estado, observaciones || null, id]);
    }

    async delete(id) {
        await db.query("UPDATE tramitaciones SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", [id]);
    }
}

module.exports = new TramitacionRepository();
