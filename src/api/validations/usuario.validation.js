const { z } = require('zod');

const loginSchema = z.object({
    username: z.string().min(1, 'Username es requerido'),
    password: z.string().min(1, 'Password es requerido')
});

module.exports = {
    loginSchema
};
