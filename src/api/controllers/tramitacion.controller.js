const TramitacionService = require('../services/tramitacion.service');

class TramitacionController {
    async getAll(req, res, next) {
        try {
            const tramitaciones = await TramitacionService.getAll();
            res.json(tramitaciones);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const userId = req.user.id;
            const id = await TramitacionService.create(req.body, userId);
            res.status(201).json({ message: 'Tramitación registrada', id });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            await TramitacionService.update(req.params.id, req.body);
            res.json({ message: 'Tramitación actualizada' });
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            await TramitacionService.delete(req.params.id);
            res.json({ message: 'Tramitación eliminada' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new TramitacionController();
