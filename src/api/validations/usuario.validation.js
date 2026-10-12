const { z } = require('zod');

const loginSchema = z.object({
    username: z.string().min(1, 'Username es requerido'),
    password: z.string().min(1, 'Password es requerido')
});

const registerSchema = z.object({
    username: z.string().min(4, 'Username debe tener al menos 4 caracteres'),
    password: z.string().min(6, 'Password debe tener al menos 6 caracteres'),
    nombre: z.string().min(1, 'Nombre es requerido'),
    email: z.string().email('Email inválido').optional().nullable().or(z.literal(''))
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
    email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
    perfil_id: parsePerfilId.optional(),
    perfil_ids: z.array(z.number().int().positive()).optional()
});

const updateStatusSchema = z.object({
    estado: z.enum(['activo', 'inactivo', 'pendiente', 'rechazado'], {
        errorMap: () => ({ message: "Estado debe ser 'activo', 'inactivo', 'pendiente' o 'rechazado'" }),
    }),
});

const updatePerfilSchema = z.object({
    perfil_id: parsePerfilId.optional(),
    perfil_ids: z.array(z.number().int().positive()).optional()
}).refine(data => data.perfil_id !== undefined || data.perfil_ids !== undefined, {
    message: 'Debe especificar perfil_id o perfil_ids'
});

const forgotPasswordSchema = z.object({
    identifier: z.string().min(1, 'Debe ingresar su usuario o correo electrónico')
});

const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token es requerido'),
    password: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
});

module.exports = {
    loginSchema,
    registerSchema,
    adminCreateSchema,
    updateStatusSchema,
    updatePerfilSchema,
    forgotPasswordSchema,
    resetPasswordSchema
};

