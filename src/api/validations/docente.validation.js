const { z } = require('zod');

const createDocenteSchema = z.object({
    rrhh_id: z.string().min(1, 'RRHH ID es requerido'),
    apellido: z.string().min(1, 'Apellido es requerido'),
    nombre: z.string().min(1, 'Nombre es requerido'),
    dni: z.string().min(1, 'DNI es requerido'),
    cuil: z.string().min(1, 'CUIL es requerido'),
    fechaNac: z.string().optional().nullable(),
    fichaCensal: z.string().optional().nullable(),
    email: z.string().email('Email inválido').optional().nullable(),
    direccion: z.string().optional().nullable(),
    telefono: z.string().optional().nullable(),
    fecha_ingreso: z.string().optional().nullable()
});

const updateDocenteSchema = createDocenteSchema.extend({
    estado: z.enum(['activo', 'inactivo']).optional()
});

module.exports = {
    createDocenteSchema,
    updateDocenteSchema
};
