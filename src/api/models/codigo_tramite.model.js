const db = require('../../../config/database');

class CodigoTramiteRepository {
    async findAll() {
        const [rows] = await db.query("SELECT * FROM codigo_tramites ORDER BY codigo ASC");
        return rows;
    }

    async findById(id) {
        const [rows] = await db.query("SELECT * FROM codigo_tramites WHERE id = ?", [id]);
        return rows[0];
    }

    async create(data) {
        const { codigo, descripcion_tramite } = data;
        const [result] = await db.query(`
            INSERT INTO codigo_tramites (codigo, descripcion_tramite)
            VALUES (?, ?)
        `, [codigo, descripcion_tramite]);
        return result.insertId;
    }

    async update(id, data) {
        const { codigo, descripcion_tramite } = data;
        await db.query(`
            UPDATE codigo_tramites SET codigo = ?, descripcion_tramite = ? WHERE id = ?
        `, [codigo, descripcion_tramite, id]);
    }

    async delete(id) {
        await db.query("DELETE FROM codigo_tramites WHERE id = ?", [id]);
    }
}

module.exports = new CodigoTramiteRepository();
