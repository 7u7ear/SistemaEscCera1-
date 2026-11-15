const DocenteRepository = require('../models/docente.model');
const AppError = require('../../shared/errors/AppError');
const { normalizeText, normalizeEmail } = require('../utils/string.util');

class DocenteService {
    async getAllDocentes() {
        return DocenteRepository.findAll();
    }

    async createDocente(docenteData) {
        const sanitized = {
            ...docenteData,
            apellido: normalizeText(docenteData.apellido),
            nombre: normalizeText(docenteData.nombre),
            email: normalizeEmail(docenteData.email)
        };
        const { rrhh_id, dni, cuil } = sanitized;
        const exists = await DocenteRepository.findDuplicate(rrhh_id, dni, cuil);
        if (exists) {
            throw new AppError('Ya existe un docente con ese RRHH ID, DNI o CUIL', 400);
        }
        return DocenteRepository.create(sanitized);
    }

    async updateDocente(id, docenteData) {
        const sanitized = {
            ...docenteData,
            apellido: normalizeText(docenteData.apellido),
            nombre: normalizeText(docenteData.nombre),
            email: normalizeEmail(docenteData.email)
        };
        const { rrhh_id, dni, cuil } = sanitized;
        const exists = await DocenteRepository.findDuplicate(rrhh_id, dni, cuil, id);
        if (exists) {
            throw new AppError('Otro docente ya tiene ese RRHH ID, DNI o CUIL', 400);
        }
        await DocenteRepository.update(id, sanitized);
    }

    async deleteDocente(id, userId) {
        await DocenteRepository.delete(id, userId);
    }

    async getDocenteCargos(id) {
        return DocenteRepository.findCargos(id);
    }

    async getDocentesByCargo(tipoCargo) {
        return DocenteRepository.findByCargo(tipoCargo);
    }

    async getPreceptores() {
        return DocenteRepository.findPreceptores();
    }
}

module.exports = new DocenteService();
