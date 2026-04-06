const db = require('../../../config/database');

class CursoRepository {
    async findAll() {
        const [rows] = await db.query("SELECT * FROM cursos ORDER BY anio, division ASC");
        return rows;
    }
}

module.exports = new CursoRepository();
