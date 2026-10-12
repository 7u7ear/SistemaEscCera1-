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

    async getEffectivePermissions(userId, perfilId) {
        const [rows] = await db.query(`
            SELECT 
                m.nombre AS modulo,
                COALESCE(um.permiso, pm.permiso, 'ninguno') AS permiso
            FROM modulos m
            LEFT JOIN usuario_modulo um ON um.modulo_id = m.id AND um.usuario_id = ?
            LEFT JOIN perfil_modulo pm ON pm.modulo_id = m.id AND pm.perfil_id = ?
            ORDER BY m.nombre
        `, [userId, perfilId]);

        const permisos = {};
        rows.forEach(r => {
            permisos[r.modulo] = r.permiso;
        });

        // Cursos y Horarios accesible si el usuario tiene permiso en estudiantes, docentes o cargos
        const tieneCursos = ['estudiantes', 'docentes', 'cargos'].some(mod => {
            const p = permisos[mod];
            return p === 'lectura' || p === 'edicion';
        });
        permisos['cursos_horarios'] = tieneCursos ? (permisos['estudiantes'] || permisos['docentes'] || 'lectura') : 'ninguno';

        return permisos;
    }

    async findById(id) {
        const [rows] = await db.query(
            `SELECT u.id, u.username, u.nombre, u.email, u.estado, u.perfil_id, p.nombre as perfil_nombre, u.created_at 
             FROM usuarios u
             LEFT JOIN perfiles p ON u.perfil_id = p.id
             WHERE u.id = ?`,
            [id]
        );
        const user = rows[0];
        if (!user) return null;

        user.permisos = await this.getEffectivePermissions(user.id, user.perfil_id);
        return user;
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
