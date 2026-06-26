const UsuarioService = require('../services/usuario.service');
const { loginSchema, registerSchema, adminCreateSchema, updateStatusSchema, updatePerfilSchema } = require('../validations/usuario.validation');
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

    async register(req, res, next) {
        try {
            const validatedData = registerSchema.parse(req.body);
            const insertId = await UsuarioService.register(validatedData);
            logger.info(`New user registered with ID ${insertId}`);
            res.status(201).json({ message: 'Usuario registrado correctamente. Pendiente de aprobación.', id: insertId });
        } catch (err) {
            next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            const userToken = req.user;
            if (!userToken) return res.status(401).json({ error: 'No autorizado' });

            const userFull = await UsuarioService.getUsuarioById(userToken.id);
            res.json(userFull);
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

    async adminCreate(req, res, next) {
        try {
            const validatedData = adminCreateSchema.parse(req.body);
            const insertId = await UsuarioService.adminCreateUser(validatedData, req.user.id);
            res.status(201).json({ message: 'Usuario creado correctamente por administrador.', id: insertId });
        } catch (err) {
            next(err);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { estado } = updateStatusSchema.parse(req.body);
            await UsuarioService.updateUserStatus(id, estado, req.user.id);
            res.json({ message: `Estado de usuario actualizado a ${estado}` });
        } catch (err) {
            next(err);
        }
    }

    async updatePerfil(req, res, next) {
        try {
            const { id } = req.params;
            const { perfil_id } = updatePerfilSchema.parse(req.body);
            await UsuarioService.updateUserPerfil(id, perfil_id, req.user.id);
            res.json({ message: `Perfil de usuario actualizado a ID ${perfil_id}` });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UsuarioController();
