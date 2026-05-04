const db = require('../../../config/database');

class AuditoriaModel {
    async create(data) {
        const { user_id, accion, entidad, entidad_id, detalles } = data;
        const [result] = await db.query(`
            INSERT INTO auditoria (user_id, accion, entidad, entidad_id, detalles, creado_el)
            VALUES (?, ?, ?, ?, ?, NOW())
        `, [user_id, accion, entidad, entidad_id, JSON.stringify(detalles || {})]);
        return result.insertId;
    }
}

module.exports = new AuditoriaModel();
