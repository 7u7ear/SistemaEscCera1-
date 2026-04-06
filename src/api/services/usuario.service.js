const UsuarioRepository = require('../repositories/usuario.repository');
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
}

module.exports = new UsuarioService();
