/**
 * Unit tests for CargoService business logic.
 */
const AppError = require('../../src/shared/errors/AppError');

jest.mock('../../src/api/models/cargo.model', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByNumeroPuesto: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  assignDocente: jest.fn(),
  bajaDocente: jest.fn(),
  findAssignmentById: jest.fn(),
  updateAssignmentState: jest.fn(),
  getHistorial: jest.fn(),
  getDistribucion: jest.fn(),
  addDistribucion: jest.fn(),
  updateDistribucion: jest.fn(),
  deleteDistribucion: jest.fn(),
  findTiposHora: jest.fn(),
  createTipoHora: jest.fn(),
  findActiveChain: jest.fn(),
}));

jest.mock('../../src/api/services/auditoria.service', () => ({
  registrar: jest.fn(),
}));

const CargoRepository = require('../../src/api/models/cargo.model');
const AuditoriaService = require('../../src/api/services/auditoria.service');
const CargoService = require('../../src/api/services/cargo.service');

describe('CargoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCargo', () => {
    it('should throw 400 if numero_puesto already exists', async () => {
      CargoRepository.findByNumeroPuesto.mockResolvedValue({ id: 1 });

      await expect(CargoService.createCargo({ numero_puesto: '101' }, 1))
        .rejects.toThrow(AppError);
    });

    it('should create cargo and record audit log', async () => {
      CargoRepository.findByNumeroPuesto.mockResolvedValue(null);
      CargoRepository.create.mockResolvedValue(55);

      const id = await CargoService.createCargo({ numero_puesto: '102', tipo_cargo: 'Profesor' }, 1);

      expect(id).toBe(55);
      expect(AuditoriaService.registrar).toHaveBeenCalledWith(1, 'CREATE', 'CARGO', 55, expect.any(Object));
    });
  });

  describe('bajaDocente', () => {
    it('should throw 404 if assignment does not exist', async () => {
      CargoRepository.findAssignmentById.mockResolvedValue(null);

      await expect(CargoService.bajaDocente(1, 99, {}, 1)).rejects.toThrow(AppError);
    });

    it('should throw 400 if assignment cargo_id does not match', async () => {
      CargoRepository.findAssignmentById.mockResolvedValue({ id: 10, cargo_id: 2 });

      await expect(CargoService.bajaDocente(1, 10, {}, 1)).rejects.toThrow(AppError);
    });

    it('should perform baja and reactivate previous titular if titular_regresa is true', async () => {
      CargoRepository.findAssignmentById.mockResolvedValue({
        id: 10,
        cargo_id: 1,
        reemplaza_a: 5,
      });

      await CargoService.bajaDocente(1, 10, { titular_regresa: true, fecha_fin: '2026-11-15' }, 1);

      expect(CargoRepository.bajaDocente).toHaveBeenCalledWith(10, { titular_regresa: true, fecha_fin: '2026-11-15' });
      expect(CargoRepository.updateAssignmentState).toHaveBeenCalledWith(5, 'activo');
      expect(AuditoriaService.registrar).toHaveBeenCalledWith(1, 'BAJA_DOCENTE', 'CARGO', 1, expect.any(Object));
    });
  });

  describe('addDistribucion', () => {
    it('should throw 400 if horas exceed cargo total_horas', async () => {
      CargoRepository.findById.mockResolvedValue({ id: 1, total_horas: 10 });
      CargoRepository.getDistribucion.mockResolvedValue([{ cantidad_horas: 8 }]);

      await expect(CargoService.addDistribucion(1, { cantidad_horas: 4 }, 1))
        .rejects.toThrow(AppError);
    });

    it('should add distribucion when total_horas is respected', async () => {
      CargoRepository.findById.mockResolvedValue({ id: 1, total_horas: 10 });
      CargoRepository.getDistribucion.mockResolvedValue([{ cantidad_horas: 4 }]);
      CargoRepository.addDistribucion.mockResolvedValue(201);

      const resId = await CargoService.addDistribucion(1, { cantidad_horas: 3, materia_id: 2 }, 1);

      expect(resId).toBe(201);
      expect(AuditoriaService.registrar).toHaveBeenCalledWith(1, 'ADD_DISTRIBUCION', 'CARGO', 1, expect.any(Object));
    });
  });
});

