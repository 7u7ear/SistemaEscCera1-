/**
 * Unit tests for DocenteService business logic.
 * Repository layer is mocked to isolate service behavior.
 */
const AppError = require('../../src/shared/errors/AppError');

jest.mock('../../src/api/repositories/docente.repository', () => ({
  findAll: jest.fn(),
  findDuplicate: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findCargos: jest.fn(),
}));

const DocenteRepository = require('../../src/api/repositories/docente.repository');
const DocenteService = require('../../src/api/services/docente.service');

describe('DocenteService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllDocentes', () => {
    it('should return all docentes from repository', async () => {
      const fakeDocentes = [{ id: 1, apellido: 'García', nombre: 'Juan' }];
      DocenteRepository.findAll.mockResolvedValue(fakeDocentes);
      const result = await DocenteService.getAllDocentes();
      expect(result).toEqual(fakeDocentes);
    });
  });

  describe('createDocente', () => {
    it('should throw 400 if a duplicate docente exists', async () => {
      DocenteRepository.findDuplicate.mockResolvedValue({ id: 99 }); // Duplicate found
      await expect(DocenteService.createDocente({
        rrhh_id: 'X001', dni: '12345678', cuil: '20123456789'
      })).rejects.toMatchObject({ status: 400 });
    });

    it('should create a docente if no duplicate exists', async () => {
      DocenteRepository.findDuplicate.mockResolvedValue(null);
      DocenteRepository.create.mockResolvedValue(5);
      const id = await DocenteService.createDocente({
        rrhh_id: 'X002', apellido: 'López', nombre: 'Ana',
        dni: '87654321', cuil: '27876543219'
      });
      expect(id).toBe(5);
      expect(DocenteRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDocenteCargos', () => {
    it('should return cargos from repository', async () => {
      const fakeCargos = [{ cargo_id: 1, numero_puesto: 'P01' }];
      DocenteRepository.findCargos.mockResolvedValue(fakeCargos);
      const result = await DocenteService.getDocenteCargos(1);
      expect(result).toEqual(fakeCargos);
    });
  });
});
