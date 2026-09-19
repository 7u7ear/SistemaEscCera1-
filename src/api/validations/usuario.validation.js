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

const parsePerfilId = z.preprocess(
    (val) => {
        if (val === '' || val === null || val === undefined) return null;
        const num = Number(val);
        return isNaN(num) ? val : num;
    },
    z.number({ invalid_type_error: 'perfil_id debe ser un número entero' }).int().positive().nullable()
);

const adminCreateSchema = z.object({
    username: z.string().min(4, 'Username debe tener al menos 4 caracteres'),
    password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
    nombre: z.string().min(1, 'Nombre es requerido'),
    perfil_id: parsePerfilId.optional(),
});

const updateStatusSchema = z.object({
    estado: z.enum(['activo', 'inactivo', 'pendiente', 'rechazado'], {
        errorMap: () => ({ message: "Estado debe ser 'activo', 'inactivo', 'pendiente' o 'rechazado'" }),
    }),
});

const updatePerfilSchema = z.object({
    perfil_id: parsePerfilId,
});

module.exports = {
    loginSchema,
    registerSchema,
    adminCreateSchema,
    updateStatusSchema,
    updatePerfilSchema,
};

