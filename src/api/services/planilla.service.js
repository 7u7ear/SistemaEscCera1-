const PlanillaRepository = require('../repositories/planilla.repository');
const AppError = require('../../shared/errors/AppError');

class PlanillaService {
    /**
     * Genera los datos procesados para la planilla.
     */
    async generarPlanilla(fecha, turno) {
        if (!fecha || !turno) {
            throw new AppError('Fecha y Turno son requeridos', 400);
        }

        const date = new Date(fecha + 'T00:00:00');
        if (isNaN(date.getTime())) {
            throw new AppError('Fecha inválida', 400);
        }

        const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const diaNombre = dias[date.getDay()];

        if (diaNombre === 'sábado' || diaNombre === 'domingo') {
            // Aunque el usuario dijo L-V, devolvemos vacío para fines de semana si se consulta
            return { cargos: [], licencias: [] };
        }

        const cargos = await PlanillaRepository.getPlanillaCargos(diaNombre, fecha, turno);
        const licencias = await PlanillaRepository.getPersonalLicencia(diaNombre, fecha, turno);

        // Procesar cargos según feedback:
        // 1. Mostrar siempre el Puesto y el Rol.
        // 2. Si hay un docente 'activo' hoy (titular o suplente), lo mostramos con su marcador [T,I,0S].
        const cargosProcesados = cargos.map(c => {
            let marker = '';
            if (c.situacion_revista === 'titular') marker = '[T] ';
            else if (c.situacion_revista === 'interino') marker = '[I] ';
            else if (c.situacion_revista === 'suplente') marker = '[S] ';

            const docenteNombreCompleto = (c.apellido && c.docente_nombre) ? 
                `${marker}${c.apellido}, ${c.docente_nombre}` : null;

            // Si el docente está 'activo' pero hoy tiene licencia, o si el puesto solo tiene al de 'licencia' (sin suplente)
            const estaAusenteHoy = (c.tiene_licencia_hoy > 0) || (c.status_docente === 'licencia');

            if (estaAusenteHoy) {
                return {
                    ...c,
                    docente_display: '', // Celda vacía para firma si está ausente/licencia
                    en_licencia: true
                };
            }

            return {
                ...c,
                docente_display: docenteNombreCompleto,
                en_licencia: false
            };
        });

        return {
            cargos: cargosProcesados,
            licencias: licencias
        };
    }
}

module.exports = new PlanillaService();
