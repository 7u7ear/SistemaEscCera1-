const LicenciaService = require('../services/licencia.service');
const { createLicenciaSchema, updateLicenciaSchema, createTipoLicenciaSchema } = require('../validations/licencia.validation');

class LicenciaController {
    async getAll(req, res, next) {
        try {
            const licencias = await LicenciaService.getAllLicencias();
            res.json(licencias);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const validatedData = createLicenciaSchema.parse(req.body);
            const userId = req.user.id;
            const result = await LicenciaService.createLicencia(validatedData, userId);
            res.status(201).json({ 
                message: 'Licencia(s) registrada(s) con éxito', 
                tramitacion_id: result.tramitacion_id 
            });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const validatedData = updateLicenciaSchema.parse(req.body);
            await LicenciaService.updateLicencia(id, validatedData);
            res.json({ message: 'Licencia actualizada con éxito' });
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await LicenciaService.deleteLicencia(id);
            res.json({ message: 'Licencia eliminada con éxito' });
        } catch (err) {
            next(err);
        }
    }

    async getTipos(req, res, next) {
        try {
            const tipos = await LicenciaService.getTiposLicencia();
            res.json(tipos);
        } catch (err) {
            next(err);
        }
    }

    async createTipo(req, res, next) {
        try {
            const validatedData = createTipoLicenciaSchema.parse(req.body);
            await LicenciaService.createTipoLicencia(validatedData.cod_licencia, validatedData.descripcion);
            res.status(201).json({ message: 'Tipo de licencia creado con éxito' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new LicenciaController();
