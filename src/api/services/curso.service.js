const CursoRepository = require('../models/curso.model');
const AppError = require('../../shared/errors/AppError');
const AuditoriaService = require('./auditoria.service');

class CursoService {
    async getAllCursos() {
        return await CursoRepository.findAll();
    }

    async getCursoById(id) {
        const curso = await CursoRepository.findById(id);
        if (!curso) {
            throw new AppError('Curso no encontrado', 404);
        }
        return curso;
    }

    async getPreceptoresByCurso(curso_id, anio_lectivo) {
        return await CursoRepository.getPreceptoresByCurso(curso_id, anio_lectivo);
    }

    async getPreceptorByCurso(curso_id, anio_lectivo) {
        return await CursoRepository.getPreceptorByCurso(curso_id, anio_lectivo);
    }

    async assignPreceptor(curso_id, docente_ids, anio_lectivo, userId = null) {
        const ids = Array.isArray(docente_ids)
            ? docente_ids
            : (docente_ids !== undefined && docente_ids !== null && docente_ids !== '' ? [docente_ids] : []);

        const result = await CursoRepository.assignPreceptor(curso_id, ids, anio_lectivo);

        if (userId) {
            await AuditoriaService.registrar(userId, 'ASSIGN_PRECEPTORES', 'CURSOS', curso_id, {
                docente_ids: ids,
                anio_lectivo
            });
        }

        return result;
    }

    /**
     * Obtiene el listado de docentes asignados al curso (materias + preceptores)
     */
    async getDocentesDelCurso(cursoId, anioLectivo) {
        await this.getCursoById(cursoId);

        const rows = await CursoRepository.getDocentesMateriasByCurso(cursoId);
        const preceptores = await CursoRepository.getPreceptoresByCurso(cursoId, anioLectivo);

        // Agrupar por materia y cargo para evitar duplicados por distintos días/módulos
        const asignacionesMap = new Map();

        rows.forEach(r => {
            const key = `${r.materia_id}-${r.cargo_id || 'sin_cargo'}`;
            if (!asignacionesMap.has(key)) {
                asignacionesMap.set(key, {
                    materia_id: r.materia_id,
                    materia_nombre: r.materia_nombre,
                    cargo_id: r.cargo_id,
                    numero_puesto: r.numero_puesto || null,
                    docente_id: r.docente_id || null,
                    docente_nombre: r.docente_nombre || null,
                    docente_apellido: r.docente_apellido || null,
                    docente_completo: (r.docente_apellido && r.docente_nombre)
                        ? `${r.docente_apellido}, ${r.docente_nombre}`
                        : 'VACANTE',
                    situacion_revista: r.situacion_revista || null,
                    email: r.docente_email || null,
                    telefono: r.docente_telefono || null,
                    rol: 'Profesor/a'
                });
            }
        });

        const listaDocentes = Array.from(asignacionesMap.values());

        // Agregar preceptores si existen
        if (preceptores && preceptores.length > 0) {
            preceptores.slice().reverse().forEach(p => {
                const rol = (p.cargo_tipo && p.cargo_tipo.toUpperCase().includes('JEFE'))
                    ? 'Jefe de Preceptores'
                    : 'Preceptor/a';

                listaDocentes.unshift({
                    materia_id: null,
                    materia_nombre: 'Preceptoría',
                    cargo_id: null,
                    numero_puesto: null,
                    docente_id: p.id,
                    docente_nombre: p.nombre,
                    docente_apellido: p.apellido,
                    docente_completo: `${p.apellido}, ${p.nombre}`,
                    situacion_revista: 'Titular',
                    email: p.email || null,
                    telefono: p.telefono || null,
                    rol: rol
                });
            });
        }

        return listaDocentes;
    }

    /**
     * Obtiene los correos organizados en 3 listas: Estudiantes, Tutores y Docentes
     */
    async getEmailsDelCurso(cursoId, anioLectivo) {
        const curso = await this.getCursoById(cursoId);

        const [estudiantesRaw, tutoresRaw, docentesAsignados] = await Promise.all([
            CursoRepository.getEstudiantesByCurso(cursoId, anioLectivo),
            CursoRepository.getTutoresByCurso(cursoId, anioLectivo),
            this.getDocentesDelCurso(cursoId, anioLectivo)
        ]);

        // 1. Estudiantes
        const estudiantes = estudiantesRaw.map(e => ({
            id: e.id,
            nombre: e.nombre,
            apellido: e.apellido,
            dni: e.dni,
            email: e.email ? e.email.trim() : null,
            has_email: Boolean(e.email && e.email.trim().length > 0)
        }));

        // 2. Tutores
        const tutores = tutoresRaw.map(t => ({
            id: t.id,
            nombre: t.nombre,
            apellido: t.apellido,
            parentesco: t.parentesco || 'Tutor',
            dni: t.dni,
            telefono: t.telefono || null,
            email: t.email ? t.email.trim() : null,
            has_email: Boolean(t.email && t.email.trim().length > 0),
            alumno_id: t.alumno_id,
            alumno_nombre_completo: `${t.alumno_apellido}, ${t.alumno_nombre}`
        }));

        // 3. Docentes únicos (un docente puede tener más de una materia en el curso)
        const docentesMap = new Map();

        docentesAsignados.forEach(d => {
            if (!d.docente_id) {return;} // Vacante
            const docId = d.docente_id;

            if (!docentesMap.has(docId)) {
                docentesMap.set(docId, {
                    id: docId,
                    nombre: d.docente_nombre,
                    apellido: d.docente_apellido,
                    nombre_completo: d.docente_completo,
                    email: d.email ? d.email.trim() : null,
                    telefono: d.telefono || null,
                    has_email: Boolean(d.email && d.email.trim().length > 0),
                    roles: new Set([d.rol]),
                    materias: new Set([d.materia_nombre])
                });
            } else {
                const item = docentesMap.get(docId);
                item.roles.add(d.rol);
                item.materias.add(d.materia_nombre);
            }
        });

        const docentes = Array.from(docentesMap.values()).map(d => ({
            id: d.id,
            nombre: d.nombre,
            apellido: d.apellido,
            nombre_completo: d.nombre_completo,
            email: d.email,
            telefono: d.telefono,
            has_email: d.has_email,
            rol: Array.from(d.roles).join(', '),
            materias: Array.from(d.materias).join(', ')
        })).sort((a, b) => a.apellido.localeCompare(b.apellido));

        return {
            curso: {
                id: curso.id,
                anio: curso.anio,
                division: curso.division,
                especialidad: curso.especialidad,
                modalidad: curso.modalidad,
                turno: curso.turno
            },
            anio_lectivo: anioLectivo,
            estudiantes,
            tutores,
            docentes,
            stats: {
                estudiantes_total: estudiantes.length,
                estudiantes_con_email: estudiantes.filter(e => e.has_email).length,
                tutores_total: tutores.length,
                tutores_con_email: tutores.filter(t => t.has_email).length,
                docentes_total: docentes.length,
                docentes_con_email: docentes.filter(d => d.has_email).length
            }
        };
    }
}

module.exports = new CursoService();
