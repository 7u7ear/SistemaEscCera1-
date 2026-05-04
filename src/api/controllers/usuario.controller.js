const UsuarioService = require('../services/usuario.service');
const { loginSchema } = require('../validations/usuario.validation');
const logger = require('../services/logger.service');
const { generarToken } = require('../utils/jwt.util');

class UsuarioController {
    async login(req, res, next) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const user = await UsuarioService.authenticate(validatedData.username, validatedData.password);
            const token = generarToken(user);
            
            logger.info(`User ${user.username} logged in successfully`);
            res.json({ message: 'Login correcto', user, token });
        } catch (err) {
            next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: 'No autorizado' });
            }
            res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            // Dado que usamos JWT, el logout normalmente se maneja en el cliente eliminando el token.
            // Si tuviéramos tabla de tokens revocados, lo haríamos aquí.
            res.json({ message: 'Logout correcto. Elimine el token en el cliente.' });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        try {
            const usuarios = await UsuarioService.getAllUsuarios();
            res.json(usuarios);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UsuarioController();
