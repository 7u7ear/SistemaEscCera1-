const db = require('../../../config/database');

class PlanillaRepository {
    /**
     * Obtiene los cargos y docentes para la planilla de firmas de un día específico y turno.
     * @param {string} diaNombre - Nombre del día (lunes, martes, etc.)
     * @param {string} fecha - Fecha en formato YYYY-MM-DD
     * @param {string} turno - 'mañana', 'tarde', 'noche'
     */
    async getPlanillaCargos(diaNombre, fecha, turno) {
        // Filtros de hora según turno
        let horaFiltro = "";
        if (turno === 'mañana') horaFiltro = "AND dh.hora_ingreso < '12:40:00'";
        else if (turno === 'tarde') horaFiltro = "AND dh.hora_ingreso >= '12:40:00' AND dh.hora_ingreso < '18:30:00'";
        else if (turno === 'noche') horaFiltro = "AND dh.hora_ingreso >= '18:30:00'";

        // Query: Buscamos el docente que está 'activo' (puede ser titular o suplente).
        // Si no hay nadie 'activo' porque el titular está de 'licencia' y no hay suplente aún,
        // igual traemos la fila pero marcamos que está en licencia.
        const [rows] = await db.query(`
            SELECT 
                dh.id AS distribucion_id,
                dh.hora_ingreso, dh.hora_egreso, dh.cantidad_horas,
                m.nombre AS materia_nombre,
                cur.anio AS curso_anio, cur.division AS curso_division,
                c.id AS cargo_id, c.numero_puesto, c.tipo_cargo,
                d.apellido, d.nombre AS docente_nombre, d.dni,
                cd.rol, cd.situacion_revista, cd.estado AS status_docente,
                (SELECT COUNT(*) FROM licencias l 
                 WHERE l.docente_id = d.id AND l.cargo_id = c.id AND l.deleted_at IS NULL 
                 AND l.fecha_inicio <= ? AND (l.fecha_fin IS NULL OR l.fecha_fin >= ?)
                ) AS tiene_licencia_hoy
            FROM distribucion_horas dh
            JOIN cargos c ON dh.cargo_id = c.id
            JOIN materias m ON dh.materia_id = m.id
            JOIN cursos cur ON dh.curso_id = cur.id
            -- Priorizamos al docente ACTIVO en este puesto (sea titular o suplente)
            LEFT JOIN cargo_docente cd ON c.id = cd.cargo_id AND cd.estado = 'activo' AND cd.deleted_at IS NULL
            -- Si no hay activo, buscamos al que está de LICENCIA para al menos mostrar el puesto/rol
            LEFT JOIN cargo_docente cd_lic ON c.id = cd_lic.cargo_id AND cd_lic.estado = 'licencia' AND cd_lic.deleted_at IS NULL AND cd.id IS NULL
            -- Unimos con el docente del registro que encontramos (preferencia activo)
            LEFT JOIN docentes d ON d.id = COALESCE(cd.docente_id, cd_lic.docente_id) AND d.deleted_at IS NULL
            WHERE dh.dia = ? AND dh.deleted_at IS NULL AND c.deleted_at IS NULL
            ${horaFiltro}
            ORDER BY dh.hora_ingreso ASC, c.numero_puesto ASC
        `, [fecha, fecha, diaNombre]);

        return rows;
    }

    /**
     * Obtiene el personal que está de licencia ese día para el listado final.
     */
    async getPersonalLicencia(diaNombre, fecha, turno) {
        let horaFiltro = "";
        if (turno === 'mañana') {
            horaFiltro = "AND dh.hora_ingreso < '12:40:00'";
        } else if (turno === 'tarde') {
            horaFiltro = "AND dh.hora_ingreso >= '12:40:00' AND dh.hora_ingreso < '18:30:00'";
        } else if (turno === 'noche') {
            horaFiltro = "AND dh.hora_ingreso >= '18:30:00'";
        }

        // Caso 1: Docentes con estado 'licencia' en cargo_docente (reemplazados por suplente)
        // Caso 2: Docentes 'activos' que tienen una licencia registrada que cubre hoy (ausentes sin suplente aún)
        const [rows] = await db.query(`
            SELECT DISTINCT
                d.apellido, d.nombre AS docente_nombre,
                cd.rol, cd.situacion_revista,
                c.numero_puesto, c.tipo_cargo,
                CASE 
                    WHEN cd.estado = 'licencia' THEN 'Con Reemplazo (Lic.)'
                    WHEN (cd.estado = 'activo' AND l.id IS NOT NULL) THEN 'Sin Reemplazo (Lic.)'
                    ELSE 'Licencia'
                END AS estado_licencia
            FROM cargo_docente cd
            JOIN docentes d ON cd.docente_id = d.id
            JOIN cargos c ON cd.cargo_id = c.id
            JOIN distribucion_horas dh ON c.id = dh.cargo_id
            -- Subconsulta para verificar si el docente activo TIENE licencia hoy
            LEFT JOIN licencias l ON d.id = l.docente_id AND c.id = l.cargo_id 
                 AND l.deleted_at IS NULL 
                 AND l.fecha_inicio <= ? AND (l.fecha_fin IS NULL OR l.fecha_fin >= ?)
            WHERE dh.dia = ? AND dh.deleted_at IS NULL
            ${horaFiltro}
            AND (
                cd.estado = 'licencia' -- Ya marcado como licencia (tiene suplente)
                OR (
                    cd.estado = 'activo' AND l.id IS NOT NULL -- Está activo pero ausente por licencia hoy
                )
            )
            ORDER BY d.apellido ASC
        `, [fecha, fecha, diaNombre]);

        return rows;
    }
}

module.exports = new PlanillaRepository();
