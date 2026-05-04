const UsuarioRepository = require('../models/usuario.model');
const AppError = require('../../shared/errors/AppError');
const bcrypt = require('bcrypt');

class UsuarioService {
    async getAllUsuarios() {
        return await UsuarioRepository.findAll();
    }

    async authenticate(username, password) {
        const user = await UsuarioRepository.findByUsername(username);

        if (!user) {
            throw new AppError('Usuario no encontrado o contraseña incorrecta', 401);
        }

        if (user.estado !== 'activo') {
            throw new AppError('Usuario pendiente de activación o inactivo', 403);
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new AppError('Usuario no encontrado o contraseña incorrecta', 401);
        }

        // Return user without password
        const { password: _, ...userSafe } = user;
        return userSafe;
    }

    async register(data) {
        const existing = await UsuarioRepository.findByUsername(data.username);
        if (existing) {
            throw new AppError('El nombre de usuario ya está en uso', 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = {
            username: data.username,
            password: hashedPassword,
            nombre: data.nombre
        };

        const insertId = await UsuarioRepository.create(newUser);
        return insertId;
    }
}

module.exports = new UsuarioService();
