const crypto = require('crypto');
const bcrypt = require('bcrypt');
const PasswordResetRepository = require('../models/password_reset.model');
const UsuarioRepository = require('../models/usuario.model');
const emailService = require('./email.service');
const AppError = require('../../shared/errors/AppError');
const logger = require('./logger.service');

class PasswordResetService {

    /**
     * Genera un token de restablecimiento y envía el correo.
     * @param {string} identifier - username o email del usuario
     */
    async requestPasswordReset(identifier) {
        const user = await UsuarioRepository.findByUsernameOrEmail(identifier);

        // Respuesta genérica por seguridad: no revelar si el usuario existe o no
        if (!user) {
            logger.warn(`Solicitud de recuperación para identificador no encontrado: ${identifier}`);
            return;
        }

        if (!user.email) {
            throw new AppError('El usuario no tiene un correo electrónico registrado. Contacte al administrador del sistema.', 400);
        }

        // Invalidar tokens anteriores del mismo usuario
        await PasswordResetRepository.invalidateUserTokens(user.id);

        // Generar token criptográficamente seguro
        const rawToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        await PasswordResetRepository.create(user.id, rawToken, expiresAt);

        // Construir enlace (en producción apuntará al dominio real)
        const baseUrl = process.env.APP_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/login.html?reset_token=${rawToken}`;

        const html = `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background: #f4f6f9; padding: 20px; color: #333; }
            .card { max-width: 580px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .header { background: #5E72E4; color: #fff; padding: 20px; text-align: center; }
            .header h2 { margin: 0; font-size: 20px; }
            .content { padding: 24px; line-height: 1.7; }
            .btn { display: inline-block; background: #5E72E4; color: #fff; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px 14px; border-radius: 4px; font-size: 13px; margin-top: 16px; }
            .footer { background: #f8f9fa; padding: 14px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eee; }
        </style>
        </head>
        <body>
        <div class="card">
            <div class="header"><h2>Sistema ECN Nº1 Cerámica</h2><p style="margin:5px 0 0;font-size:14px;">Recuperación de Contraseña</p></div>
            <div class="content">
                <p>Hola <strong>${user.nombre || user.username}</strong>,</p>
                <p>Recibiste este correo porque solicitaste restablecer tu contraseña en el Sistema de Gestión Escolar.</p>
                <p>Hacé clic en el botón para crear una nueva contraseña:</p>
                <a href="${resetLink}" class="btn">Restablecer Contraseña</a>
                <div class="warning">
                    ⏱ Este enlace es válido por <strong>1 hora</strong>.<br>
                    🔒 Si no solicitaste este cambio, podés ignorar este correo.
                </div>
            </div>
            <div class="footer">Mensaje automático — Sistema de Gestión Escolar ECN Nº1 Cerámica (CERA 1)</div>
        </div>
        </body></html>`;

        await emailService.sendMail(
            user.email,
            'Recuperación de contraseña — ECN Nº1 Cerámica',
            html
        );

        logger.info(`Token de recuperación generado para usuario ID ${user.id}`);
    }

    /**
     * Valida el token y actualiza la contraseña.
     * @param {string} token
     * @param {string} newPassword
     */
    async resetPassword(token, newPassword) {
        const record = await PasswordResetRepository.findValidToken(token);

        if (!record) {
            throw new AppError('El enlace de recuperación no es válido o ya expiró.', 400);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UsuarioRepository.updatePassword(record.usuario_id, hashedPassword);

        // Marcar el token como usado
        await PasswordResetRepository.markAsUsed(record.id);

        logger.info(`Contraseña restablecida para usuario ID ${record.usuario_id}`);
    }
}

module.exports = new PasswordResetService();
