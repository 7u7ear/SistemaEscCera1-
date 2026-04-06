const TramitacionRepository = require('../repositories/tramitacion.repository');
const AppError = require('../../shared/errors/AppError');

class TramitacionService {
    async getAll() {
        return await TramitacionRepository.findAll();
    }

    async create(data, userId) {
        return await TramitacionRepository.create({ ...data, created_by: userId });
    }

    async update(id, data) {
        const existing = await TramitacionRepository.findById(id);
        if (!existing) throw new AppError('Tramitación no encontrada', 404);
        await TramitacionRepository.update(id, data);
    }

    async delete(id) {
        const existing = await TramitacionRepository.findById(id);
        if (!existing) throw new AppError('Tramitación no encontrada', 404);
        await TramitacionRepository.delete(id);
    }
}

module.exports = new TramitacionService();
