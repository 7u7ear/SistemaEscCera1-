const MateriaRepository = require('../repositories/materia.repository');

class MateriaService {
    async getAllMaterias() {
        return await MateriaRepository.findAll();
    }
}

module.exports = new MateriaService();
