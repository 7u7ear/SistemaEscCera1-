const PasswordResetService = require('../services/password_reset.service');
const { forgotPasswordSchema, resetPasswordSchema } = require('../validations/usuario.validation');

class PasswordResetController {
    async forgotPassword(req, res, next) {
        try {
            const { identifier } = forgotPasswordSchema.parse(req.body);
            await PasswordResetService.requestPasswordReset(identifier);
            // Respuesta genérica para no revelar si el usuario/email existe
            res.json({ success: true, message: 'Si el usuario existe y tiene correo registrado, recibirá un enlace para restablecer su contraseña.' });
        } catch (err) {
            next(err);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { token, password } = resetPasswordSchema.parse(req.body);
            await PasswordResetService.resetPassword(token, password);
            res.json({ success: true, message: 'Contraseña restablecida correctamente. Ya podés iniciar sesión.' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new PasswordResetController();
