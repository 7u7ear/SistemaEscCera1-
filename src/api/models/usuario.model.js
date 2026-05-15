const db = require('../../../config/database');

class UsuarioRepository {
    async findAll() {
        const [rows] = await db.query("SELECT id, username, nombre, estado, perfil_id, created_at FROM usuarios");
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
        const { username, password, nombre, perfil_id, estado } = usuario;
        const [result] = await db.query(
            "INSERT INTO usuarios (username, password, nombre, estado, perfil_id) VALUES (?, ?, ?, ?, ?)",
            [username, password, nombre, estado || 'pendiente', perfil_id || null]
        );
        return result.insertId;
    }

    async findById(id) {
        const [rows] = await db.query(
            `SELECT u.id, u.username, u.nombre, u.estado, u.perfil_id, p.nombre as perfil_nombre, u.created_at 
             FROM usuarios u
             LEFT JOIN perfiles p ON u.perfil_id = p.id
             WHERE u.id = ?`,
            [id]
        );
        return rows[0];
    }

    async updateStatus(id, estado) {
        await db.query(
            "UPDATE usuarios SET estado = ? WHERE id = ?",
            [estado, id]
        );
    }

    async updatePerfil(id, perfil_id) {
        await db.query(
            "UPDATE usuarios SET perfil_id = ? WHERE id = ?",
            [perfil_id, id]
        );
    }
}

module.exports = new UsuarioRepository();
