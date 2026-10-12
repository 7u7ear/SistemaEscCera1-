const db = require('../../../config/database');

class UsuarioRepository {
    async findAll() {
        const [rows] = await db.query(`
            SELECT u.id, u.username, u.nombre, u.email, u.estado, u.perfil_id,
                   p.nombre AS perfil_nombre, u.created_at
            FROM usuarios u
            LEFT JOIN perfiles p ON u.perfil_id = p.id
            ORDER BY u.created_at DESC
        `);
        return rows;
    }

    async findAllPerfiles() {
        const [rows] = await db.query('SELECT id, nombre FROM perfiles ORDER BY nombre');
        return rows;
    }

    async findByUsername(username) {
        const [rows] = await db.query(
            "SELECT * FROM usuarios WHERE username = ?",
            [username]
        );
        return rows[0];
    }

    async findByUsernameOrEmail(identifier) {
        const [rows] = await db.query(
            "SELECT * FROM usuarios WHERE (username = ? OR email = ?) AND activo = 1",
            [identifier, identifier]
        );
        return rows[0] || null;
    }

    async create(usuario) {
        const { username, password, nombre, email, perfil_id, estado } = usuario;
        const [result] = await db.query(
            "INSERT INTO usuarios (username, password, nombre, email, estado, perfil_id) VALUES (?, ?, ?, ?, ?, ?)",
            [username, password, nombre, email || null, estado || 'pendiente', perfil_id || null]
        );
        return result.insertId;
    }

    async findById(id) {
        const [rows] = await db.query(
            `SELECT u.id, u.username, u.nombre, u.email, u.estado, u.perfil_id, p.nombre as perfil_nombre, u.created_at 
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

    async updatePassword(id, hashedPassword) {
        await db.query(
            "UPDATE usuarios SET password = ? WHERE id = ?",
            [hashedPassword, id]
        );
    }
}

module.exports = new UsuarioRepository();
