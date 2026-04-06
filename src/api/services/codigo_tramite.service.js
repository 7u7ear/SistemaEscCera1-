const CodigoTramiteRepository = require('../repositories/codigo_tramite.repository');
const AppError = require('../../shared/errors/AppError');

class CodigoTramiteService {
    async getAll() {
        return await CodigoTramiteRepository.findAll();
    }

    async create(data) {
        if (!data.codigo || !data.descripcion) {
            throw new AppError('Código y descripción son obligatorios', 400);
        }
        return await CodigoTramiteRepository.create({
            codigo: data.codigo,
            descripcion_tramite: data.descripcion
        });
    }

    async update(id, data) {
        const existing = await CodigoTramiteRepository.findById(id);
        if (!existing) throw new AppError('Código de trámite no encontrado', 404);
        await CodigoTramiteRepository.update(id, {
            codigo: data.codigo,
            descripcion_tramite: data.descripcion
        });
    }

    async delete(id) {
        const existing = await CodigoTramiteRepository.findById(id);
        if (!existing) throw new AppError('Código de trámite no encontrado', 404);
        await CodigoTramiteRepository.delete(id);
    }
}

module.exports = new CodigoTramiteService();
