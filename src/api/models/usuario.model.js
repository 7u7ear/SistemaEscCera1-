const db = require('../../../config/database');

class UsuarioRepository {
    async findAll() {
        const [rows] = await db.query("SELECT id, username, estado, created_at FROM usuarios");
        return rows;
    }

    async findByUsername(username) {
        const [rows] = await db.query(
            "SELECT * FROM usuarios WHERE username = ?",
            [username]
        );
        return rows[0];
    }
}

module.exports = new UsuarioRepository();
