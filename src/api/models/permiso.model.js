const db = require('../../../config/database');

class PermisoModel {
    async getMatriz() {
        const [perfiles] = await db.query('SELECT id, nombre FROM perfiles ORDER BY nombre');
        const [modulos] = await db.query('SELECT id, nombre FROM modulos ORDER BY nombre');
        const [permisos] = await db.query('SELECT perfil_id, modulo_id, permiso FROM perfil_modulo');
        return { perfiles, modulos, permisos };
    }

    async upsertPermiso(perfil_id, modulo_id, permiso) {
        await db.query(
            `INSERT INTO perfil_modulo (perfil_id, modulo_id, permiso)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE permiso = ?`,
            [perfil_id, modulo_id, permiso, permiso]
        );
    }
}

module.exports = new PermisoModel();
