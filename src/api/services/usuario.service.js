const UsuarioRepository = require('../models/usuario.model');
const AppError = require('../../shared/errors/AppError');
const bcrypt = require('bcrypt');
const AuditoriaService = require('./auditoria.service');

class UsuarioService {
    async getAllUsuarios() {
        return await UsuarioRepository.findAll();
    }

    async getAllPerfiles() {
        return await UsuarioRepository.findAllPerfiles();
    }

    async getUsuarioById(id) {
        return await UsuarioRepository.findById(id);
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

    async adminCreateUser(data, adminId) {
        const existing = await UsuarioRepository.findByUsername(data.username);
        if (existing) {
            throw new AppError('El nombre de usuario ya está en uso', 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = {
            ...data,
            password: hashedPassword,
            estado: 'activo'
        };

        const insertId = await UsuarioRepository.create(newUser);
        await AuditoriaService.registrar(adminId, 'CREATE_USER_ADMIN', 'USUARIOS', insertId, { username: data.username, perfil_id: data.perfil_id });
        return insertId;
    }

    async updateUserStatus(id, estado, adminId) {
        const user = await UsuarioRepository.findById(id);
        if (!user) throw new AppError('Usuario no encontrado', 404);

        await UsuarioRepository.updateStatus(id, estado);
        await AuditoriaService.registrar(adminId, 'UPDATE_STATUS', 'USUARIOS', id, { estado_anterior: user.estado, nuevo_estado: estado });
    }

    async updateUserPerfil(id, perfil_id, adminId) {
        const user = await UsuarioRepository.findById(id);
        if (!user) throw new AppError('Usuario no encontrado', 404);

        await UsuarioRepository.updatePerfil(id, perfil_id);
        await AuditoriaService.registrar(adminId, 'UPDATE_PERFIL', 'USUARIOS', id, { perfil_anterior: user.perfil_id, nuevo_perfil: perfil_id });
    }
}

module.exports = new UsuarioService();
