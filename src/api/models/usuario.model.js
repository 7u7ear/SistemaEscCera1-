const db = require('../../../config/database');

class UsuarioRepository {
    async findAll() {
        const [rows] = await db.query(`
            SELECT u.id, u.username, u.nombre, u.email, u.estado, u.perfil_id,
                   p.nombre AS perfil_nombre_principal,
                   GROUP_CONCAT(p_all.nombre ORDER BY p_all.nombre SEPARATOR ', ') AS perfiles_nombres,
                   GROUP_CONCAT(p_all.id ORDER BY p_all.nombre) AS perfiles_ids,
                   u.created_at
            FROM usuarios u
            LEFT JOIN perfiles p ON u.perfil_id = p.id
            LEFT JOIN usuario_perfil up ON u.id = up.usuario_id
            LEFT JOIN perfiles p_all ON up.perfil_id = p_all.id
            GROUP BY u.id, u.username, u.nombre, u.email, u.estado, u.perfil_id, p.nombre, u.created_at
            ORDER BY u.created_at DESC
        `);

        return rows.map(r => {
            const perfilIds = r.perfiles_ids ? r.perfiles_ids.split(',').map(Number) : (r.perfil_id ? [r.perfil_id] : []);
            const perfilNombres = r.perfiles_nombres 
                ? r.perfiles_nombres.split(', ') 
                : (r.perfil_nombre_principal ? [r.perfil_nombre_principal] : []);
            return {
                ...r,
                perfil_nombre: r.perfiles_nombres || r.perfil_nombre_principal || null,
                perfil_ids: perfilIds,
                perfiles_nombres: perfilNombres
            };
        });
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

    async create(usuario, connection = null) {
        const executor = connection || db;
        const { username, password, nombre, email, perfil_id, perfil_ids, estado } = usuario;
        const primaryPerfilId = Array.isArray(perfil_ids) && perfil_ids.length > 0 
            ? perfil_ids[0] 
            : (perfil_id || null);

        const [result] = await executor.query(
            "INSERT INTO usuarios (username, password, nombre, email, estado, perfil_id) VALUES (?, ?, ?, ?, ?, ?)",
            [username, password, nombre, email || null, estado || 'pendiente', primaryPerfilId]
        );
        const insertId = result.insertId;

        const effectiveIds = Array.isArray(perfil_ids) && perfil_ids.length > 0 
            ? perfil_ids 
            : (perfil_id ? [perfil_id] : []);

        if (effectiveIds.length > 0) {
            const values = effectiveIds.map(pId => [insertId, pId]);
            await executor.query(
                "INSERT INTO usuario_perfil (usuario_id, perfil_id) VALUES ?",
                [values]
            );
        }

        return insertId;
    }

    async getEffectivePermissions(userId, perfilIds) {
        let ids = [];
        if (Array.isArray(perfilIds)) {
            ids = perfilIds.map(Number).filter(Boolean);
        } else if (perfilIds) {
            ids = [Number(perfilIds)].filter(Boolean);
        }

        let rows = [];
        if (ids.length > 0) {
            [rows] = await db.query(`
                SELECT 
                    m.nombre AS modulo,
                    um.permiso AS user_permiso,
                    MAX(CASE pm.permiso 
                        WHEN 'edicion' THEN 2 
                        WHEN 'lectura' THEN 1 
                        ELSE 0 
                    END) AS max_perfil_level
                FROM modulos m
                LEFT JOIN usuario_modulo um ON um.modulo_id = m.id AND um.usuario_id = ?
                LEFT JOIN perfil_modulo pm ON pm.modulo_id = m.id AND pm.perfil_id IN (?)
                GROUP BY m.id, m.nombre, um.permiso
                ORDER BY m.nombre
            `, [userId, ids]);
        } else {
            [rows] = await db.query(`
                SELECT 
                    m.nombre AS modulo,
                    um.permiso AS user_permiso,
                    0 AS max_perfil_level
                FROM modulos m
                LEFT JOIN usuario_modulo um ON um.modulo_id = m.id AND um.usuario_id = ?
                GROUP BY m.id, m.nombre, um.permiso
                ORDER BY m.nombre
            `, [userId]);
        }

        const levelToPermiso = { 2: 'edicion', 1: 'lectura', 0: 'ninguno' };
        const permisos = {};
        rows.forEach(r => {
            if (r.user_permiso) {
                permisos[r.modulo] = r.user_permiso;
            } else {
                permisos[r.modulo] = levelToPermiso[r.max_perfil_level || 0];
            }
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
        if (!user) {return null;}

        const [perfilesRows] = await db.query(`
            SELECT p.id, p.nombre
            FROM usuario_perfil up
            JOIN perfiles p ON up.perfil_id = p.id
            WHERE up.usuario_id = ?
            ORDER BY p.nombre
        `, [id]);

        user.perfiles = perfilesRows;
        user.perfil_ids = perfilesRows.map(p => p.id);
        if (user.perfil_ids.length === 0 && user.perfil_id) {
            user.perfil_ids = [user.perfil_id];
        }
        user.perfiles_nombres = perfilesRows.map(p => p.nombre).join(', ') || user.perfil_nombre || '';
        user.perfil_nombre = user.perfiles_nombres || user.perfil_nombre;

        user.permisos = await this.getEffectivePermissions(user.id, user.perfil_ids);
        return user;
    }

    async updateStatus(id, estado) {
        await db.query(
            "UPDATE usuarios SET estado = ? WHERE id = ?",
            [estado, id]
        );
    }

    async updatePerfiles(userId, perfilIds, connection = null) {
        const executor = connection || db;
        await executor.query("DELETE FROM usuario_perfil WHERE usuario_id = ?", [userId]);

        const ids = Array.isArray(perfilIds) ? perfilIds.map(Number).filter(Boolean) : [];
        if (ids.length > 0) {
            const values = ids.map(pId => [userId, pId]);
            await executor.query(
                "INSERT INTO usuario_perfil (usuario_id, perfil_id) VALUES ?",
                [values]
            );
        }

        const primaryPerfilId = ids.length > 0 ? ids[0] : null;
        await executor.query(
            "UPDATE usuarios SET perfil_id = ? WHERE id = ?",
            [primaryPerfilId, userId]
        );
    }

    async updatePerfil(id, perfil_id) {
        const ids = perfil_id ? [perfil_id] : [];
        await this.updatePerfiles(id, ids);
    }

    async updatePassword(id, hashedPassword) {
        await db.query(
            "UPDATE usuarios SET password = ? WHERE id = ?",
            [hashedPassword, id]
        );
    }
}

module.exports = new UsuarioRepository();
