const { z } = require('zod');

const createCargoSchema = z.object({
    numero_puesto: z.string().min(1, 'Número de puesto es requerido'),
    tipo_cargo: z.string().min(1, 'Tipo de cargo es requerido'),
    total_horas: z.number().optional().nullable()
});

const updateCargoSchema = z.object({
    numero_puesto: z.string().min(1),
    tipo_cargo: z.string().min(1),
    total_horas: z.number().optional().nullable(),
    estado: z.enum(['activo', 'inactivo']).optional()
});

const assignDocenteSchema = z.object({
    docente_id: z.number({ required_error: 'Docente es requerido' }),
    situacion_revista: z.enum(['titular', 'interino', 'suplente']).optional(),
    fecha_inicio: z.string().optional().nullable(),
    reemplaza_a: z.number().optional().nullable(),
    rol: z.number().optional(),
    expediente_alta: z.string().optional().nullable()
});

const addDistribucionSchema = z.object({
    materia_id: z.number({ required_error: 'Materia es requerida' }),
    curso_id: z.number({ required_error: 'Curso es requerido' }),
    cantidad_horas: z.union([z.number(), z.string().transform(Number)]),
    tipo_hora_id: z.number().optional().nullable(),
    dia: z.enum(['lunes', 'martes', 'miércoles', 'jueves', 'viernes']),
    hora_ingreso: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).optional().nullable(),
    hora_egreso: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/).optional().nullable()
});

module.exports = {
    createCargoSchema,
    updateCargoSchema,
    assignDocenteSchema,
    addDistribucionSchema
};
