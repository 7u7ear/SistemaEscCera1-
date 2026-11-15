const MateriaRepository = require('../models/materia.model');
const AppError = require('../../shared/errors/AppError');
const AuditoriaService = require('./auditoria.service');
const { normalizeText } = require('../utils/string.util');

class MateriaService {
    async getAllMaterias() {
        return MateriaRepository.findAll();
    }

    async createMateria(data, userId) {
        const nombreNormalizado = normalizeText(data.nombre);
        if (!nombreNormalizado) {
            throw new AppError('El nombre de la materia es requerido', 400);
        }

        const existing = await MateriaRepository.findByNombre(nombreNormalizado);
        if (existing) {
            throw new AppError('Ya existe una materia con ese nombre', 400);
        }

        const materiaId = await MateriaRepository.create(nombreNormalizado);

        if (userId) {
            await AuditoriaService.registrar(userId, 'CREATE', 'MATERIAS', materiaId, {
                nombre: nombreNormalizado
            });
        }

        return {
            id: materiaId,
            nombre: nombreNormalizado
        };
    }
}

module.exports = new MateriaService();
