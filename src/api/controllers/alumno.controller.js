const AlumnoService = require('../services/alumno.service');
const {
    createAlumnoSchema,
    updateAlumnoSchema,
    inscribirAlumnoSchema,
    paseCursoSchema,
    materiasAdeudadasSchema
} = require('../validations/alumno.validation');

class AlumnoController {
    async getAll(req, res, next) {
        try {
            const data = await AlumnoService.getAllAlumnos();
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const data = await AlumnoService.getAlumnoById(id);
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    async create(req, res, next) {
        try {
            const validated = createAlumnoSchema.parse(req.body);
            const insertId = await AlumnoService.createAlumno(validated, req.user.id);
            res.status(201).json({ message: 'Alumno creado correctamente', id: insertId });
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const validated = updateAlumnoSchema.parse(req.body);
            await AlumnoService.updateAlumno(id, validated, req.user.id);
            res.json({ message: 'Alumno actualizado correctamente' });
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await AlumnoService.deleteAlumno(id, req.user.id);
            res.json({ message: 'Alumno eliminado correctamente' });
        } catch (err) {
            next(err);
        }
    }

    async matricular(req, res, next) {
        try {
            const validated = inscribirAlumnoSchema.parse(req.body);
            const insertId = await AlumnoService.matricularAlumno(validated, req.user.id);
            res.status(201).json({ message: 'Alumno matriculado correctamente', id: insertId });
        } catch (err) {
            next(err);
        }
    }

    async desinscribir(req, res, next) {
        try {
            const { alumnoId, cursoId, anioLectivo } = req.body;
            if (!alumnoId || !cursoId || !anioLectivo) {
                return res.status(400).json({ error: 'Faltan parámetros requeridos (alumnoId, cursoId, anioLectivo)' });
            }
            await AlumnoService.desinscribirAlumno(alumnoId, cursoId, anioLectivo, req.user.id);
            res.json({ message: 'Alumno desinscrito correctamente' });
        } catch (err) {
            next(err);
        }
    }

    async trasladar(req, res, next) {
        try {
            const validated = paseCursoSchema.parse(req.body);
            await AlumnoService.trasladarAlumno(validated, req.user.id);
            res.json({ message: 'Pase de curso realizado correctamente' });
        } catch (err) {
            next(err);
        }
    }

    async getMovimientos(req, res, next) {
        try {
            const { id } = req.params;
            const data = await AlumnoService.getMovimientos(id);
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    async getPorCurso(req, res, next) {
        try {
            const { cursoId } = req.params;
            const { anioLectivo } = req.query;
            if (!anioLectivo) {
                return res.status(400).json({ error: 'El parámetro anioLectivo es requerido' });
            }
            const data = await AlumnoService.getAlumnosPorCurso(cursoId, parseInt(anioLectivo));
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    // --- Materias Adeudadas ---
    async getMateriasAdeudadas(req, res, next) {
        try {
            const { id } = req.params;
            const data = await AlumnoService.getMateriasAdeudadas(id);
            res.json(data);
        } catch (err) {
            next(err);
        }
    }

    async createMateriaAdeudada(req, res, next) {
        try {
            const validated = materiasAdeudadasSchema.parse(req.body);
            const insertId = await AlumnoService.createMateriaAdeudada(validated, req.user.id);
            res.status(201).json({ message: 'Materia adeudada registrada', id: insertId });
        } catch (err) {
            next(err);
        }
    }

    async updateMateriaAdeudada(req, res, next) {
        try {
            const { id } = req.params;
            const { estado } = req.body;
            if (!estado || !['pendiente', 'aprobada'].includes(estado)) {
                return res.status(400).json({ error: 'Estado inválido o no especificado (pendiente/aprobada)' });
            }
            await AlumnoService.updateMateriaAdeudada(id, estado, req.user.id);
            res.json({ message: 'Materia adeudada actualizada correctamente' });
        } catch (err) {
            next(err);
        }
    }

    async deleteMateriaAdeudada(req, res, next) {
        try {
            const { id } = req.params;
            await AlumnoService.deleteMateriaAdeudada(id, req.user.id);
            res.json({ message: 'Materia adeudada eliminada correctamente' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new AlumnoController();
