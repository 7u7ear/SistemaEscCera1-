const PlanillaService = require('../services/planilla.service');

class PlanillaController {
    /**
     * Obtiene los cargos y licencias para generar la planilla de firmas.
     */
    async getPlanilla(req, res, next) {
        try {
            const { fecha, turno } = req.query;
            const data = await PlanillaService.generarPlanilla(fecha, turno);
            res.json(data);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new PlanillaController();
