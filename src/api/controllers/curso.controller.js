const CursoService = require('../services/curso.service');
const db = require('../../../config/database');

class CursoController {
    async getAll(req, res, next) {
        try {
            const cursos = await CursoService.getAllCursos();
            res.json(cursos);
        } catch (err) {
            next(err);
        }
    }

    async getHorario(req, res, next) {
        try {
            const { id } = req.params;
            const [rows] = await db.query(`
                SELECT dh.*, m.nombre AS materia_nombre,
                       c.numero_puesto,
                       (SELECT CONCAT(d.apellido, ', ', d.nombre)
                        FROM cargo_docente cd2
                        JOIN docentes d ON cd2.docente_id = d.id
                        WHERE cd2.cargo_id = dh.cargo_id 
                          AND cd2.estado = 'activo' 
                          AND cd2.deleted_at IS NULL
                        ORDER BY cd2.fecha_inicio DESC
                        LIMIT 1) AS docente_display,
                       (SELECT cd2.situacion_revista
                        FROM cargo_docente cd2
                        WHERE cd2.cargo_id = dh.cargo_id 
                          AND cd2.estado = 'activo' 
                          AND cd2.deleted_at IS NULL
                        ORDER BY cd2.fecha_inicio DESC
                        LIMIT 1) AS situacion_revista,
                       (SELECT cd2.id
                        FROM cargo_docente cd2
                        WHERE cd2.cargo_id = dh.cargo_id 
                          AND cd2.estado = 'activo' 
                          AND cd2.deleted_at IS NULL
                        ORDER BY cd2.fecha_inicio DESC
                        LIMIT 1) AS cargo_docente_id
                FROM distribucion_horas dh
                JOIN materias m ON dh.materia_id = m.id
                JOIN cargos c ON dh.cargo_id = c.id
                WHERE dh.curso_id = ? AND dh.deleted_at IS NULL
                ORDER BY FIELD(dh.dia, 'lunes', 'martes', 'miércoles', 'jueves', 'viernes'), dh.hora_ingreso
            `, [id]);
            res.json(rows);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CursoController();
