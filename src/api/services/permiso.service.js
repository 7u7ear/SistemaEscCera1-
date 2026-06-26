const PermisoModel = require('../models/permiso.model');

class PermisoService {
    async getMatriz() {
        return await PermisoModel.getMatriz();
    }

    async updatePermiso(perfil_id, modulo_id, permiso) {
        await PermisoModel.upsertPermiso(perfil_id, modulo_id, permiso);
    }
}

module.exports = new PermisoService();
