const db = require('../../../config/database');

class CursoRepository {
    async findAll() {
        const [rows] = await db.query("SELECT * FROM cursos ORDER BY anio, division ASC");
        return rows;
    }

    async getPreceptorByCurso(curso_id, anio_lectivo) {
        const [rows] = await db.query(`
            SELECT d.id, d.nombre, d.apellido, d.email
            FROM curso_preceptor cp
            JOIN docentes d ON cp.docente_id = d.id
            WHERE cp.curso_id = ? AND cp.anio_lectivo = ?
        `, [curso_id, anio_lectivo]);
        return rows[0] || null;
    }

    async assignPreceptor(curso_id, docente_id, anio_lectivo) {
        const [result] = await db.query(`
            INSERT INTO curso_preceptor (curso_id, docente_id, anio_lectivo, created_at, updated_at)
            VALUES (?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE 
                docente_id = VALUES(docente_id),
                updated_at = NOW()
        `, [curso_id, docente_id, anio_lectivo]);
        return result;
    }
}

module.exports = new CursoRepository();
