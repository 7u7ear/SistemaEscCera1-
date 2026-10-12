const auditoriaService = require('../services/auditoria.service');
const logger = require('../services/logger.service');

class AuditoriaController {
    async getAll(req, res) {
        try {
            const { fechaDesde, fechaHasta, usuarioId, entidad, accion, page, limit } = req.query;
            const resultado = await auditoriaService.obtener({
                fechaDesde: fechaDesde || null,
                fechaHasta: fechaHasta || null,
                usuarioId: usuarioId || null,
                entidad: entidad || null,
                accion: accion || null,
                page: page || 1,
                limit: limit || 50
            });
            res.json({ success: true, data: resultado });
        } catch (error) {
            logger.error(`Error al obtener auditoria: ${error.message}`);
            res.status(500).json({ success: false, error: { message: 'Error al obtener el registro de auditoria' } });
        }
    }

    async getFiltros(req, res) {
        try {
            const filtros = await auditoriaService.obtenerFiltros();
            res.json({ success: true, data: filtros });
        } catch (error) {
            logger.error(`Error al obtener filtros de auditoria: ${error.message}`);
            res.status(500).json({ success: false, error: { message: 'Error al obtener filtros' } });
        }
    }
}

module.exports = new AuditoriaController();
