const PermisoModel = require('../models/permiso.model');

class PermisoService {
    async getMatriz() {
        return await PermisoModel.getMatriz();
    }

    async updatePermiso(perfil_id, modulo_id, permiso) {
        await PermisoModel.upsertPermiso(perfil_id, modulo_id, permiso);
    }

    async getPermisosUsuario(userId, perfilId) {
        const UsuarioRepository = require('../models/usuario.model');
        return await UsuarioRepository.getEffectivePermissions(userId, perfilId);
    }
}

module.exports = new PermisoService();

