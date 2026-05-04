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

module.exports = {
    loginSchema,
    registerSchema
};
