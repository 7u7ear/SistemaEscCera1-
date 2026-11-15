const MateriaRepository = require('../models/materia.model');

class MateriaService {
    async getAllMaterias() {
        return MateriaRepository.findAll();
    }
}

module.exports = new MateriaService();
