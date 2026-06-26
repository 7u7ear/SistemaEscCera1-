const PermisoService = require('../services/permiso.service');
const { updatePermisoSchema } = require('../validations/permiso.validation');

class PermisoController {
    async getMatriz(req, res, next) {
        try {
            const matriz = await PermisoService.getMatriz();
            res.json(matriz);
        } catch (err) {
            next(err);
        }
    }

    async updatePermiso(req, res, next) {
        try {
            const { perfil_id, modulo_id, permiso } = updatePermisoSchema.parse(req.body);
            await PermisoService.updatePermiso(perfil_id, modulo_id, permiso);
            res.json({ message: 'Permiso actualizado correctamente' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new PermisoController();
