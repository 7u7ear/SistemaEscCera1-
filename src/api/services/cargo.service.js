const CargoRepository = require('../repositories/cargo.repository');
const AppError = require('../../shared/errors/AppError');
const logger = require('../services/logger.service');

class CargoService {
    async getAllCargos() {
        return await CargoRepository.findAll();
    }

    async createCargo(cargoData) {
        const { numero_puesto } = cargoData;
        const exists = await CargoRepository.findByNumeroPuesto(numero_puesto);
        if (exists) {
            throw new AppError('Ya existe un cargo con ese número de puesto', 400);
        }
        return await CargoRepository.create(cargoData);
    }

    async updateCargo(id, cargoData) {
        const { numero_puesto } = cargoData;
        const exists = await CargoRepository.findByNumeroPuesto(numero_puesto, id);
        if (exists) {
            throw new AppError('Otro cargo ya tiene ese número de puesto', 400);
        }
        await CargoRepository.update(id, cargoData);
    }

    async deleteCargo(id, userId) {
        await CargoRepository.delete(id, userId);
    }

    async assignDocente(cargoId, assignmentData) {
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
        return await CargoRepository.assignDocente(data);
    }

    async getHistorial(id) {
        return await CargoRepository.getHistorial(id);
    }

    async getDistribucionByCargo(cargoId) {
        return await CargoRepository.getDistribucion(cargoId);
    }

    async addDistribucion(cargoId, data) {
        // Enforce the cargo_id in the data
        const distributionData = { ...data, cargo_id: cargoId };
        return await CargoRepository.addDistribucion(distributionData);
    }

    // --- Tipos de Hora ---
    async getTiposHora() {
        return await CargoRepository.findTiposHora();
    }

    async createTipoHora(nombre, descripcion) {
        return await CargoRepository.createTipoHora(nombre, descripcion);
    }

    // --- Cadena Activa ---
    async getActiveChain(cargoId) {
        return await CargoRepository.findActiveChain(cargoId);
    }
}

module.exports = new CargoService();
