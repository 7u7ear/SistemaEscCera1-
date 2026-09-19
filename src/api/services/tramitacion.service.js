const TramitacionRepository = require('../models/tramitacion.model');
const AppError = require('../../shared/errors/AppError');
const AuditoriaService = require('./auditoria.service');

class TramitacionService {
    async getAll() {
        return await TramitacionRepository.findAll();
    }

    async create(data, userId) {
        const id = await TramitacionRepository.create({ ...data, created_by: userId });
        await AuditoriaService.registrar(userId, 'CREATE', 'TRAMITACIONES', id, { docente_id: data.docente_id, codigo_tramite_id: data.codigo_tramite_id });
        return id;
    }

    async update(id, data, userId) {
        const existing = await TramitacionRepository.findById(id);
        if (!existing) throw new AppError('Tramitación no encontrada', 404);
        await TramitacionRepository.update(id, data);
        await AuditoriaService.registrar(userId, 'UPDATE', 'TRAMITACIONES', id, { estado: data.estado });
    }

    async delete(id, userId) {
        const existing = await TramitacionRepository.findById(id);
        if (!existing) throw new AppError('Tramitación no encontrada', 404);
        await TramitacionRepository.delete(id);
        await AuditoriaService.registrar(userId, 'DELETE', 'TRAMITACIONES', id, { docente_id: existing.docente_id });
    }
}

module.exports = new TramitacionService();
