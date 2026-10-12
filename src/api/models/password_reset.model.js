const db = require('../../../config/database');

class PasswordResetRepository {
    async create(usuarioId, token, expiresAt) {
        const [result] = await db.query(
            "INSERT INTO password_resets (usuario_id, token, expires_at) VALUES (?, ?, ?)",
            [usuarioId, token, expiresAt]
        );
        return result.insertId;
    }

    async findValidToken(token) {
        const [rows] = await db.query(`
            SELECT pr.*, u.username, u.nombre, u.email
            FROM password_resets pr
            JOIN usuarios u ON pr.usuario_id = u.id
            WHERE pr.token = ? 
              AND pr.used_at IS NULL 
              AND pr.expires_at > NOW()
              AND u.activo = 1
            LIMIT 1
        `, [token]);
        return rows[0] || null;
    }

    async markAsUsed(id) {
        await db.query(
            "UPDATE password_resets SET used_at = NOW() WHERE id = ?",
            [id]
        );
    }

    async invalidateUserTokens(usuarioId) {
        await db.query(
            "UPDATE password_resets SET used_at = NOW() WHERE usuario_id = ? AND used_at IS NULL",
            [usuarioId]
        );
    }
}

module.exports = new PasswordResetRepository();
