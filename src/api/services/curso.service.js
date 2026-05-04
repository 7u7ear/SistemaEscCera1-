const CursoRepository = require('../models/curso.model');

class CursoService {
    async getAllCursos() {
        return await CursoRepository.findAll();
    }
}

module.exports = new CursoService();
