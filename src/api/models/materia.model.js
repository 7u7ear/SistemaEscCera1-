const db = require('../../../config/database');

class MateriaRepository {
    async findAll() {
        const [rows] = await db.query("SELECT * FROM materias WHERE deleted_at IS NULL ORDER BY nombre ASC");
        return rows;
    }

    async findById(id) {
        const [rows] = await db.query("SELECT * FROM materias WHERE id = ? AND deleted_at IS NULL", [id]);
        return rows[0];
    }

    async findByNombre(nombre) {
        const [rows] = await db.query("SELECT * FROM materias WHERE UPPER(nombre) = UPPER(?) AND deleted_at IS NULL", [nombre]);
        return rows[0];
    }

    async create(nombre) {
        const [result] = await db.query(
            "INSERT INTO materias (nombre, created_at, updated_at) VALUES (?, NOW(), NOW())",
            [nombre]
        );
        return result.insertId;
    }
}

module.exports = new MateriaRepository();
