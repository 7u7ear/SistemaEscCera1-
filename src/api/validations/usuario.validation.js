const { z } = require('zod');

const loginSchema = z.object({
    username: z.string().min(1, 'Username es requerido'),
    password: z.string().min(1, 'Password es requerido')
});

const registerSchema = z.object({
    username: z.string().min(4, 'Username debe tener al menos 4 caracteres'),
    password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
    nombre: z.string().min(1, 'Nombre es requerido')
});

const adminCreateSchema = z.object({
    username: z.string().min(4, 'Username debe tener al menos 4 caracteres'),
    password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
    nombre: z.string().min(1, 'Nombre es requerido'),
    perfil_id: z.coerce.number().optional().nullable(),
});

const updateStatusSchema = z.object({
    estado: z.enum(['activo', 'inactivo', 'pendiente', 'rechazado'], {
        errorMap: () => ({ message: "Estado debe ser 'activo', 'inactivo', 'pendiente' o 'rechazado'" }),
    }),
});

const updatePerfilSchema = z.object({
    perfil_id: z.coerce.number({ required_error: 'perfil_id es requerido' }).nullable(),
});

module.exports = {
    loginSchema,
    registerSchema,
    adminCreateSchema,
    updateStatusSchema,
    updatePerfilSchema,
};
