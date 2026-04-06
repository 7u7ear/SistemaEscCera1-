const DocenteService = require('../services/docente.service');
const { createDocenteSchema, updateDocenteSchema } = require('../validations/docente.validation');

class DocenteController {
    async getAll(req, res, next) {
        try {
            const docentes = await DocenteService.getAllDocentes();
            res.json(docentes);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const validatedData = createDocenteSchema.parse(req.body);
            const id = await DocenteService.createDocente(validatedData);
            res.status(201).json({ message: 'Docente creado con éxito', id });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const validatedData = updateDocenteSchema.parse(req.body);
            await DocenteService.updateDocente(id, validatedData);
            res.json({ message: 'Docente actualizado con éxito' });
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.session.user.id;
            await DocenteService.deleteDocente(id, userId);
            res.json({ message: 'Docente eliminado con éxito' });
        } catch (err) {
            next(err);
        }
    }

    async getCargos(req, res, next) {
        try {
            const { id } = req.params;
            const cargos = await DocenteService.getDocenteCargos(id);
            res.json(cargos);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new DocenteController();
