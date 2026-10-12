const db = require('../../../config/database');
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

        return await UsuarioRepository.findById(user.id);
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
            nombre: data.nombre,
            email: data.email || null
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
        const conn = await db.getConnection();
        let insertId;
        try {
            await conn.beginTransaction();
            const newUser = {
                ...data,
                password: hashedPassword,
                estado: 'activo'
            };
            insertId = await UsuarioRepository.create(newUser, conn);
            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }

        const perfilIds = data.perfil_ids || (data.perfil_id ? [data.perfil_id] : []);
        await AuditoriaService.registrar(adminId, 'CREATE_USER_ADMIN', 'USUARIOS', insertId, { 
            username: data.username, 
            perfil_ids: perfilIds 
        });
        return insertId;
    }

    async updateUserStatus(id, estado, adminId) {
        const user = await UsuarioRepository.findById(id);
        if (!user) throw new AppError('Usuario no encontrado', 404);

        await UsuarioRepository.updateStatus(id, estado);
        await AuditoriaService.registrar(adminId, 'UPDATE_STATUS', 'USUARIOS', id, { estado_anterior: user.estado, nuevo_estado: estado });
    }

    async updateUserPerfiles(id, perfilIds, adminId) {
        const user = await UsuarioRepository.findById(id);
        if (!user) throw new AppError('Usuario no encontrado', 404);

        const ids = Array.isArray(perfilIds) ? perfilIds.map(Number).filter(Boolean) : [];

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            await UsuarioRepository.updatePerfiles(id, ids, conn);
            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }

        await AuditoriaService.registrar(adminId, 'UPDATE_PERFILES', 'USUARIOS', id, { 
            perfiles_anteriores: user.perfil_ids || [], 
            nuevos_perfiles: ids 
        });
    }

    async updateUserPerfil(id, perfil_id, adminId) {
        const ids = Array.isArray(perfil_id) ? perfil_id : (perfil_id ? [perfil_id] : []);
        return await this.updateUserPerfiles(id, ids, adminId);
    }
}

module.exports = new UsuarioService();
