const CursoRepository = require('../repositories/curso.repository');

class CursoService {
    async getAllCursos() {
        return await CursoRepository.findAll();
    }
}

module.exports = new CursoService();
