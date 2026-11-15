/**
 * Unit tests for MateriaService.
 */

jest.mock('../../src/api/models/materia.model', () => ({
  findAll: jest.fn(),
  findByNombre: jest.fn(),
  create: jest.fn()
}));

jest.mock('../../src/api/services/auditoria.service', () => ({
  registrar: jest.fn()
}));

const MateriaRepository = require('../../src/api/models/materia.model');
const MateriaService = require('../../src/api/services/materia.service');
const AuditoriaService = require('../../src/api/services/auditoria.service');

describe('MateriaService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllMaterias', () => {
    it('debe retornar todas las materias desde el repositorio', async () => {
      const fake = [{ id: 1, nombre: 'MATEMATICA' }];
      MateriaRepository.findAll.mockResolvedValue(fake);
      const res = await MateriaService.getAllMaterias();
      expect(res).toEqual(fake);
    });
  });

  describe('createMateria', () => {
    it('debe lanzar error 400 si el nombre es vacío', async () => {
      await expect(MateriaService.createMateria({ nombre: '   ' }, 1))
        .rejects.toMatchObject({ status: 400 });
    });

    it('debe lanzar error 400 si la materia ya existe', async () => {
      MateriaRepository.findByNombre.mockResolvedValue({ id: 10, nombre: 'EDUCACION FISICA' });
      await expect(MateriaService.createMateria({ nombre: 'Educación Física' }, 1))
        .rejects.toMatchObject({ status: 400 });
    });

    it('debe normalizar el texto a mayúsculas sin acentos, crear y auditar', async () => {
      MateriaRepository.findByNombre.mockResolvedValue(null);
      MateriaRepository.create.mockResolvedValue(15);

      const result = await MateriaService.createMateria({ nombre: '  educación artística  ' }, 2);

      expect(MateriaRepository.create).toHaveBeenCalledWith('EDUCACION ARTISTICA');
      expect(AuditoriaService.registrar).toHaveBeenCalledWith(2, 'CREATE', 'MATERIAS', 15, {
        nombre: 'EDUCACION ARTISTICA'
      });
      expect(result).toEqual({ id: 15, nombre: 'EDUCACION ARTISTICA' });
    });
  });
});
