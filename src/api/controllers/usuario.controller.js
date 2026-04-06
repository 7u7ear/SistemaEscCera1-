const UsuarioService = require('../services/usuario.service');
const { loginSchema } = require('../validations/usuario.validation');
const logger = require('../services/logger.service');

class UsuarioController {
    async login(req, res, next) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const user = await UsuarioService.authenticate(validatedData.username, validatedData.password);
            
            req.session.user = user;
            logger.info(`User ${user.username} logged in successfully`);
            res.json({ message: 'Login correcto', user });
        } catch (err) {
            next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'No autorizado' });
            }
            res.json(req.session.user);
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            req.session.destroy((err) => {
                if (err) return next(err);
                res.json({ message: 'Logout correcto' });
            });
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
