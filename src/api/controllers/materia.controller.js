const MateriaService = require('../services/materia.service');
const { createMateriaSchema } = require('../validations/materia.validation');

class MateriaController {
    async getAll(req, res, next) {
        try {
            const materias = await MateriaService.getAllMaterias();
            res.json(materias);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const validated = createMateriaSchema.parse(req.body);
            const result = await MateriaService.createMateria(validated, req.user ? req.user.id : null);
            res.status(201).json({
                success: true,
                data: result
            });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new MateriaController();
