const CursoRepository = require('../models/curso.model');

class CursoService {
    async getAllCursos() {
        return await CursoRepository.findAll();
    }

    async getPreceptorByCurso(curso_id, anio_lectivo) {
        return await CursoRepository.getPreceptorByCurso(curso_id, anio_lectivo);
    }

    async assignPreceptor(curso_id, docente_id, anio_lectivo) {
        return await CursoRepository.assignPreceptor(curso_id, docente_id, anio_lectivo);
    }
}

module.exports = new CursoService();
