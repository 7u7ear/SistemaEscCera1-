const db = require('../../../config/database');

class MateriaRepository {
    async findAll() {
        const [rows] = await db.query("SELECT * FROM materias ORDER BY nombre ASC");
        return rows;
    }
}

module.exports = new MateriaRepository();
