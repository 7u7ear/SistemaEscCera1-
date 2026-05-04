const db = require('../../../config/database');

class UsuarioRepository {
    async findAll() {
        const [rows] = await db.query("SELECT id, username, estado, perfil, created_at FROM usuarios");
        return rows;
    }

    async findByUsername(username) {
        const [rows] = await db.query(
            "SELECT * FROM usuarios WHERE username = ?",
            [username]
        );
        return rows[0];
    }

    async create(usuario) {
        const { username, password, nombre } = usuario;
        const [result] = await db.query(
            "INSERT INTO usuarios (username, password, nombre, estado, perfil) VALUES (?, ?, ?, 'pendiente', NULL)",
            [username, password, nombre]
        );
        return result.insertId;
    }
}

module.exports = new UsuarioRepository();
