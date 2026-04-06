const MateriaService = require('../services/materia.service');

class MateriaController {
    async getAll(req, res, next) {
        try {
            const materias = await MateriaService.getAllMaterias();
            res.json(materias);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new MateriaController();
