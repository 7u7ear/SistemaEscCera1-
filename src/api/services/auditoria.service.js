const AuditoriaModel = require('../models/auditoria.model');
const logger = require('./logger.service');

class AuditoriaService {
    async registrar(userId, accion, entidad, entidadId = null, detalles = null) {
        try {
            if (!userId) {
                logger.warn(`No se proporcionó userId para la auditoría: ${accion} en ${entidad}`);
                return;
            }
            await AuditoriaModel.create({
                user_id: userId,
                accion,
                entidad,
                entidad_id: entidadId,
                detalles
            });
        } catch (error) {
            // No queremos que falle la operación principal si falla la auditoría
            logger.error(`Error guardando auditoría: ${error.message}`);
        }
    }
}

module.exports = new AuditoriaService();
