const CargoService = require('../services/cargo.service');
const { createCargoSchema, updateCargoSchema, assignDocenteSchema, addDistribucionSchema, createTipoHoraSchema, bajaDocenteSchema } = require('../validations/cargo.validation');
const logger = require('../services/logger.service');

class CargoController {
    async getAll(req, res, next) {
        try {
            const cargos = await CargoService.getAllCargos();
            res.json(cargos);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const validatedData = createCargoSchema.parse(req.body);
            const userId = req.user?.id;
            const id = await CargoService.createCargo(validatedData, userId);
            res.status(201).json({ message: 'Cargo creado con éxito', id });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const validatedData = updateCargoSchema.parse(req.body);
            const userId = req.user?.id;
            await CargoService.updateCargo(id, validatedData, userId);
            res.json({ message: 'Cargo actualizado con éxito' });
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            await CargoService.deleteCargo(id, userId);
            res.json({ message: 'Cargo eliminado con éxito' });
        } catch (err) {
            next(err);
        }
    }

    async assignDocente(req, res, next) {
        try {
            const { id } = req.params;
            const validatedData = assignDocenteSchema.parse(req.body);
            const userId = req.user?.id;
            await CargoService.assignDocente(id, validatedData, userId);
            res.json({ message: 'Docente asignado con éxito' });
        } catch (err) {
            next(err);
        }
    }

    async bajaDocente(req, res, next) {
        try {
            const { id, cargoDocenteId } = req.params;
            const validatedData = bajaDocenteSchema.parse(req.body);
            const userId = req.user?.id;
            await CargoService.bajaDocente(id, cargoDocenteId, validatedData, userId);
            res.json({ message: 'Baja registrada con éxito' });
        } catch (err) {
            next(err);
        }
    }

    async getHistorial(req, res, next) {
        try {
            const { id } = req.params;
            const historial = await CargoService.getHistorial(id);
            res.json(historial);
        } catch (err) {
            next(err);
        }
    }

    async getDistribucion(req, res, next) {
        try {
            const { id } = req.params;
            const distribucion = await CargoService.getDistribucionByCargo(id);
            res.json(distribucion);
        } catch (err) {
            next(err);
        }
    }

    async addDistribucion(req, res, next) {
        try {
            const { id } = req.params;
            const validatedData = addDistribucionSchema.parse(req.body);
            const userId = req.user?.id;
            await CargoService.addDistribucion(id, validatedData, userId);
            res.status(201).json({ message: 'Distribución agregada con éxito' });
        } catch (err) {
            next(err);
        }
    }

    async updateDistribucion(req, res, next) {
        try {
            const { id } = req.params; // ID de la distribución
            const validatedData = addDistribucionSchema.parse(req.body);
            const userId = req.user?.id;
            await CargoService.updateDistribucion(id, validatedData, userId);
            res.json({ message: 'Distribución actualizada con éxito' });
        } catch (err) {
            next(err);
        }
    }

    async deleteDistribucion(req, res, next) {
        try {
            const { id } = req.params; // ID de la distribución
            const userId = req.user?.id;
            await CargoService.deleteDistribucion(id, userId);
            res.json({ message: 'Distribución eliminada con éxito' });
        } catch (err) {
            next(err);
        }
    }

    // --- Tipos de Hora ---
    async getTiposHora(req, res, next) {
        try {
            const tipos = await CargoService.getTiposHora();
            res.json(tipos);
        } catch (err) {
            next(err);
        }
    }

    async createTipoHora(req, res, next) {
        try {
            const { nombre, descripcion } = createTipoHoraSchema.parse(req.body);
            const userId = req.user?.id;
            await CargoService.createTipoHora(nombre, descripcion, userId);
            res.status(201).json({ message: 'Tipo de hora creado' });
        } catch (err) {
            next(err);
        }
    }

    // --- Cadena Activa ---
    async getActiveChain(req, res, next) {
        try {
            const { id } = req.params;
            const chain = await CargoService.getActiveChain(id);
            res.json(chain);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CargoController();
