const CargoRepository = require('../models/cargo.model');
const AppError = require('../../shared/errors/AppError');
const logger = require('../services/logger.service');
const AuditoriaService = require('../services/auditoria.service');

class CargoService {
    async getAllCargos() {
        return await CargoRepository.findAll();
    }

    async createCargo(cargoData, userId) {
        const { numero_puesto } = cargoData;
        const exists = await CargoRepository.findByNumeroPuesto(numero_puesto);
        if (exists) {
            throw new AppError('Ya existe un cargo con ese número de puesto', 400);
        }
        const cargoId = await CargoRepository.create(cargoData);
        await AuditoriaService.registrar(userId, 'CREATE', 'CARGO', cargoId, cargoData);
        return cargoId;
    }

    async updateCargo(id, cargoData, userId) {
        const { numero_puesto } = cargoData;
        const exists = await CargoRepository.findByNumeroPuesto(numero_puesto, id);
        if (exists) {
            throw new AppError('Otro cargo ya tiene ese número de puesto', 400);
        }
        await CargoRepository.update(id, cargoData);
        await AuditoriaService.registrar(userId, 'UPDATE', 'CARGO', id, cargoData);
    }

    async deleteCargo(id, userId) {
        await CargoRepository.delete(id, userId);
        await AuditoriaService.registrar(userId, 'DELETE', 'CARGO', id, { id });
    }

    async assignDocente(cargoId, assignmentData, userId) {
        const { docente_id, situacion_revista, fecha_inicio, reemplaza_a } = assignmentData;
        
        if (!docente_id) throw new AppError('Docente es requerido', 400);

        const activos = await CargoRepository.findActiveAssignments(cargoId);
        const titularActivo = activos.find(a => a.situacion_revista === 'titular');

        // Business Logic Validation
        if (titularActivo && situacion_revista === 'interino') {
            throw new AppError('No se puede asignar un Interino porque ya existe un Titular activo en este Puesto.', 400);
        }

        if (situacion_revista === 'suplente' && !reemplaza_a) {
            throw new AppError('Debe seleccionar a quién reemplaza el Suplente.', 400);
        }

        // State Transitions
        if (reemplaza_a) {
            await CargoRepository.updateAssignmentState(reemplaza_a, 'licencia');
        } else if (situacion_revista === 'titular') {
            await CargoRepository.inactivatePrevious(cargoId, ['titular', 'interino', 'suplente'], fecha_inicio);
        } else if (situacion_revista === 'interino') {
            await CargoRepository.inactivatePrevious(cargoId, ['interino'], fecha_inicio);
        }

        const data = { ...assignmentData, cargo_id: cargoId };
        const asigId = await CargoRepository.assignDocente(data);
        await AuditoriaService.registrar(userId, 'ASSIGN_DOCENTE', 'CARGO', cargoId, assignmentData);
        return asigId;
    }

    async getHistorial(id) {
        return await CargoRepository.getHistorial(id);
    }

    async getDistribucionByCargo(cargoId) {
        return await CargoRepository.getDistribucion(cargoId);
    }

    async addDistribucion(cargoId, data, userId) {
        const cargo = await CargoRepository.findById(cargoId);
        if (!cargo) throw new AppError('El cargo no existe', 404);
        
        const distActual = await CargoRepository.getDistribucion(cargoId);
        const horasActuales = distActual.reduce((acc, curr) => acc + curr.cantidad_horas, 0);
        if (horasActuales + data.cantidad_horas > cargo.total_horas) {
            throw new AppError(`No se pueden asignar ${data.cantidad_horas} horas. Supera el total de horas del puesto (${cargo.total_horas}).`, 400);
        }

        // Enforce the cargo_id in the data
        const distributionData = { ...data, cargo_id: cargoId };
        const resId = await CargoRepository.addDistribucion(distributionData);
        await AuditoriaService.registrar(userId, 'ADD_DISTRIBUCION', 'CARGO', cargoId, data);
        return resId;
    }

    async updateDistribucion(id, data, userId) {
        const currentData = Object.assign({}, data);
        await CargoRepository.updateDistribucion(id, data);
        await AuditoriaService.registrar(userId, 'UPDATE_DISTRIBUCION', 'CARGO_DISTRIBUCION', id, currentData);
    }

    async deleteDistribucion(id, userId) {
        await CargoRepository.deleteDistribucion(id);
        await AuditoriaService.registrar(userId, 'DELETE_DISTRIBUCION', 'CARGO_DISTRIBUCION', id, { id });
    }

    // --- Tipos de Hora ---
    async getTiposHora() {
        return await CargoRepository.findTiposHora();
    }

    async createTipoHora(nombre, descripcion, userId) {
        const id = await CargoRepository.createTipoHora(nombre, descripcion);
        await AuditoriaService.registrar(userId, 'CREATE', 'TIPO_HORA', id, { nombre, descripcion });
        return id;
    }

    // --- Cadena Activa ---
    async getActiveChain(cargoId) {
        return await CargoRepository.findActiveChain(cargoId);
    }
}

module.exports = new CargoService();
