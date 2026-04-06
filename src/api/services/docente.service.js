const DocenteRepository = require('../repositories/docente.repository');
const AppError = require('../../shared/errors/AppError');

class DocenteService {
    async getAllDocentes() {
        return await DocenteRepository.findAll();
    }

    async createDocente(docenteData) {
        const { rrhh_id, dni, cuil } = docenteData;
        const exists = await DocenteRepository.findDuplicate(rrhh_id, dni, cuil);
        if (exists) {
            throw new AppError('Ya existe un docente con ese RRHH ID, DNI o CUIL', 400);
        }
        return await DocenteRepository.create(docenteData);
    }

    async updateDocente(id, docenteData) {
        const { rrhh_id, dni, cuil } = docenteData;
        const exists = await DocenteRepository.findDuplicate(rrhh_id, dni, cuil, id);
        if (exists) {
            throw new AppError('Otro docente ya tiene ese RRHH ID, DNI o CUIL', 400);
        }
        await DocenteRepository.update(id, docenteData);
    }

    async deleteDocente(id, userId) {
        await DocenteRepository.delete(id, userId);
    }

    async getDocenteCargos(id) {
        return await DocenteRepository.findCargos(id);
    }
}

module.exports = new DocenteService();
