const CursoService = require('../services/curso.service');

class CursoController {
    async getAll(req, res, next) {
        try {
            const cursos = await CursoService.getAllCursos();
            res.json(cursos);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CursoController();
