const CodigoTramiteService = require('../services/codigo_tramite.service');

class CodigoTramiteController {
    async getAll(req, res, next) {
        try {
            const codigos = await CodigoTramiteService.getAll();
            res.json(codigos);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const id = await CodigoTramiteService.create(req.body);
            res.status(201).json({ message: 'Código de trámite creado', id });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            await CodigoTramiteService.update(req.params.id, req.body);
            res.json({ message: 'Código de trámite actualizado' });
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            await CodigoTramiteService.delete(req.params.id);
            res.json({ message: 'Código de trámite eliminado' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CodigoTramiteController();
