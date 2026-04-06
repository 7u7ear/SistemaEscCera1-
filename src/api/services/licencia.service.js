const LicenciaRepository = require('../repositories/licencia.repository');
const TramitacionRepository = require('../repositories/tramitacion.repository');
const AppError = require('../../shared/errors/AppError');
const logger = require('../services/logger.service');

class LicenciaService {
    async getAllLicencias() {
        return await LicenciaRepository.findAll();
    }

    async createLicencia(licenciaData, userId) {
        const { 
            docente_id, cargo_ids, fecha_inicio, fecha_fin, tipo_licencia, 
            corresponde_expediente, expediente, observaciones, actualizar_puesto,
            generar_tramite, codigo_tramite_id 
        } = licenciaData;

        let tramitacionId = null;

        // 1. Integration: Auto-generate tramitación if requested (Rule 3 - Service logic)
        if (generar_tramite && codigo_tramite_id) {
            tramitacionId = await TramitacionRepository.create({
                fecha: fecha_inicio,
                docente_id,
                expediente,
                codigo_tramite_id,
                estado: 'caratulado',
                observaciones: `Trámite generado automáticamente por registro de licencia: ${tipo_licencia}`,
                created_by: userId
            });
        }

        const targets = (!cargo_ids || cargo_ids.length === 0) ? [null] : cargo_ids;
        const results = [];

        for (const cid of targets) {
            const lid = await LicenciaRepository.create({
                docente_id,
                cargo_id: cid,
                tramitacion_id: tramitacionId,
                fecha_inicio,
                fecha_fin,
                tipo_licencia,
                corresponde_expediente,
                expediente,
                observaciones
            });
            results.push(lid);

            // Update cargo state (Rule 1: Layered state transition)
            if (actualizar_puesto && cid && docente_id) {
                await LicenciaRepository.updateCargoDocenteState(cid, docente_id, 'activo', 'licencia');
            }
        }

        return { licencias: results, tramitacion_id: tramitacionId };
    }

    async updateLicencia(id, updateData) {
        const { finalizar_puesto } = updateData;
        const currentLicencia = await LicenciaRepository.findById(id);
        if (!currentLicencia) throw new AppError('Licencia no encontrada', 404);

        await LicenciaRepository.update(id, updateData);

        // If license ends, restore cargo status to 'activo'
        if (finalizar_puesto && currentLicencia.cargo_id && currentLicencia.docente_id) {
            await LicenciaRepository.updateCargoDocenteState(currentLicencia.cargo_id, currentLicencia.docente_id, 'licencia', 'activo');
        }
    }

    async deleteLicencia(id) {
        await LicenciaRepository.delete(id);
    }

    async getTiposLicencia() {
        return await LicenciaRepository.findTipos();
    }

    async createTipoLicencia(cod, desc) {
        if (!cod || !desc) throw new AppError('Código y descripción obligatorios', 400);
        return await LicenciaRepository.createTipo(cod, desc);
    }
}

module.exports = new LicenciaService();
