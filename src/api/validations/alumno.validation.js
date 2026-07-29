const { z } = require('zod');

const familiarSchema = z.object({
    id: z.union([z.string(), z.number()]).optional().nullable(),
    parentesco: z.string().optional().nullable(),
    nombre: z.string().min(1, 'Nombre del familiar es requerido'),
    apellido: z.string().min(1, 'Apellido del familiar es requerido'),
    dni: z.string().min(1, 'DNI del familiar es requerido'),
    telefono: z.string().optional().nullable(),
    email: z.string().email('Email de familiar inválido').optional().nullable().or(z.literal(''))
});

const createAlumnoSchema = z.object({
    apellido: z.string().min(1, 'Apellido es requerido'),
    nombre: z.string().min(1, 'Nombre es requerido'),
    dni: z.string().min(1, 'DNI es requerido'),
    fecha_nacimiento: z.string().min(1, 'Fecha de nacimiento es requerida'),
    direccion: z.string().optional().nullable(),
    email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
    familiar: familiarSchema.optional().nullable(),
    familiares: z.array(familiarSchema).optional().nullable()
});

const updateAlumnoSchema = z.object({
    apellido: z.string().min(1, 'Apellido es requerido'),
    nombre: z.string().min(1, 'Nombre es requerido'),
    dni: z.string().min(1, 'DNI es requerido'),
    fecha_nacimiento: z.string().min(1, 'Fecha de nacimiento es requerida'),
    direccion: z.string().optional().nullable(),
    email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
    familiares: z.array(familiarSchema).optional().nullable()
});

const inscribirAlumnoSchema = z.object({
    alumno_id: z.union([z.string(), z.number()]),
    curso_id: z.union([z.string(), z.number()]),
    anio_lectivo: z.number().int().min(2000).max(2100)
});

const paseCursoSchema = z.object({
    alumno_id: z.union([z.string(), z.number()]),
    curso_origen_id: z.union([z.string(), z.number()]).optional().nullable(),
    curso_destino_id: z.union([z.string(), z.number()]),
    anio_lectivo: z.number().int().min(2000).max(2100)
});

const materiasAdeudadasSchema = z.object({
    alumno_id: z.union([z.string(), z.number()]),
    materia_id: z.union([z.string(), z.number()]),
    estado: z.enum(['pendiente', 'aprobada'])
});

module.exports = {
    createAlumnoSchema,
    updateAlumnoSchema,
    inscribirAlumnoSchema,
    paseCursoSchema,
    materiasAdeudadasSchema
};
