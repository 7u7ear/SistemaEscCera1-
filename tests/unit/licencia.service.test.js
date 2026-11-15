/**
 * Unit tests for LicenciaService business logic.
 */
const AppError = require('../../src/shared/errors/AppError');

jest.mock('../../src/api/models/licencia.model', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findTipos: jest.fn(),
  createTipo: jest.fn(),
  updateCargoDocenteState: jest.fn(),
  findDocenteInfo: jest.fn(),
  findCargoInfo: jest.fn(),
  findPreceptoresByCargo: jest.fn(),
}));

jest.mock('../../src/api/models/tramitacion.model', () => ({
  create: jest.fn(),
}));

jest.mock('../../src/api/services/auditoria.service', () => ({
  registrar: jest.fn(),
}));

jest.mock('../../src/api/services/email.service', () => ({
  sendMail: jest.fn(),
}));

const LicenciaRepository = require('../../src/api/models/licencia.model');
const TramitacionRepository = require('../../src/api/models/tramitacion.model');
const AuditoriaService = require('../../src/api/services/auditoria.service');
const LicenciaService = require('../../src/api/services/licencia.service');

describe('LicenciaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLicencias', () => {
    it('should return all licencias from repository', async () => {
      const fakeLicencias = [{ id: 1, tipo_licencia: 'Artículo 70' }];
      LicenciaRepository.findAll.mockResolvedValue(fakeLicencias);

      const result = await LicenciaService.getAllLicencias();
      expect(result).toEqual(fakeLicencias);
    });
  });

  describe('createLicencia', () => {
    it('should create licencias and register audit log', async () => {
      LicenciaRepository.create.mockResolvedValue(101);

      const data = {
        docente_id: 5,
        cargo_ids: [10],
        fecha_inicio: '2026-11-16',
        fecha_fin: '2026-11-20',
        tipo_licencia: 'Médica',
        actualizar_puesto: true,
        generar_tramite: false,
      };

      const result = await LicenciaService.createLicencia(data, 1);

      expect(result.licencias).toEqual([101]);
      expect(LicenciaRepository.create).toHaveBeenCalledTimes(1);
      expect(LicenciaRepository.updateCargoDocenteState).toHaveBeenCalledWith(10, 5, 'activo', 'licencia');
      expect(AuditoriaService.registrar).toHaveBeenCalledWith(1, 'CREATE', 'LICENCIAS', 101, expect.any(Object));
    });

    it('should automatically generate a tramitacion if requested', async () => {
      TramitacionRepository.create.mockResolvedValue(999);
      LicenciaRepository.create.mockResolvedValue(102);

      const data = {
        docente_id: 3,
        cargo_ids: [12],
        fecha_inicio: '2026-11-16',
        tipo_licencia: 'Largo Tratamiento',
        generar_tramite: true,
        codigo_tramite_id: 2,
        actualizar_puesto: false,
      };

      const result = await LicenciaService.createLicencia(data, 1);

      expect(TramitacionRepository.create).toHaveBeenCalledTimes(1);
      expect(result.tramitacion_id).toBe(999);
      expect(LicenciaRepository.updateCargoDocenteState).not.toHaveBeenCalled();
    });
  });

  describe('updateLicencia', () => {
    it('should throw 404 if licencia not found', async () => {
      LicenciaRepository.findById.mockResolvedValue(null);

      await expect(LicenciaService.updateLicencia(99, {}, 1)).rejects.toThrow(AppError);
    });

    it('should restore cargo status when finalizar_puesto is true', async () => {
      LicenciaRepository.findById.mockResolvedValue({
        id: 1,
        cargo_id: 10,
        docente_id: 5,
      });

      await LicenciaService.updateLicencia(1, { fecha_fin: '2026-11-18', finalizar_puesto: true }, 1);

      expect(LicenciaRepository.update).toHaveBeenCalledWith(1, { fecha_fin: '2026-11-18', finalizar_puesto: true });
      expect(LicenciaRepository.updateCargoDocenteState).toHaveBeenCalledWith(10, 5, 'licencia', 'activo');
      expect(AuditoriaService.registrar).toHaveBeenCalledWith(1, 'UPDATE', 'LICENCIAS', 1, { finalizar_puesto: true });
    });
  });

  describe('deleteLicencia', () => {
    it('should throw 404 if licencia does not exist', async () => {
      LicenciaRepository.findById.mockResolvedValue(null);

      await expect(LicenciaService.deleteLicencia(99, 1)).rejects.toThrow(AppError);
    });

    it('should soft delete and audit', async () => {
      LicenciaRepository.findById.mockResolvedValue({ id: 2, docente_id: 7 });

      await LicenciaService.deleteLicencia(2, 1);

      expect(LicenciaRepository.delete).toHaveBeenCalledWith(2);
      expect(AuditoriaService.registrar).toHaveBeenCalledWith(1, 'DELETE', 'LICENCIAS', 2, { docente_id: 7 });
    });
  });
});

