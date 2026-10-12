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

    async getAll({ fechaDesde, fechaHasta, usuarioId, entidad, accion, page = 1, limit = 50 }) {
        const conditions = [];
        const params = [];

        if (fechaDesde) {
            conditions.push('a.creado_el >= ?');
            params.push(fechaDesde + ' 00:00:00');
        }
        if (fechaHasta) {
            conditions.push('a.creado_el <= ?');
            params.push(fechaHasta + ' 23:59:59');
        }
        if (usuarioId) {
            conditions.push('a.user_id = ?');
            params.push(usuarioId);
        }
        if (entidad) {
            conditions.push('a.entidad = ?');
            params.push(entidad);
        }
        if (accion) {
            conditions.push('a.accion = ?');
            params.push(accion);
        }

        const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
        const offset = (page - 1) * limit;

        const [rows] = await db.query(`
            SELECT 
                a.id,
                a.accion,
                a.entidad,
                a.entidad_id,
                a.detalles,
                a.creado_el,
                u.nombre AS usuario_nombre,
                u.username AS usuario_username
            FROM auditoria a
            LEFT JOIN usuarios u ON a.user_id = u.id
            ${where}
            ORDER BY a.creado_el DESC
            LIMIT ? OFFSET ?
        `, [...params, parseInt(limit), parseInt(offset)]);

        const [[{ total }]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM auditoria a
            LEFT JOIN usuarios u ON a.user_id = u.id
            ${where}
        `, params);

        return { rows, total, page: parseInt(page), limit: parseInt(limit) };
    }

    async getEntidades() {
        const [rows] = await db.query('SELECT DISTINCT entidad FROM auditoria ORDER BY entidad');
        return rows.map(r => r.entidad);
    }

    async getAcciones() {
        const [rows] = await db.query('SELECT DISTINCT accion FROM auditoria ORDER BY accion');
        return rows.map(r => r.accion);
    }
}

module.exports = new AuditoriaModel();

