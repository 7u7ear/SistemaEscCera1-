const MateriaRepository = require('../models/materia.model');

class MateriaService {
    async getAllMaterias() {
        return await MateriaRepository.findAll();
    }
}

module.exports = new MateriaService();
