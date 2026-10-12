const express = require('express');
const PasswordResetController = require('../../controllers/password_reset.controller');

const router = express.Router();

// POST /api/v1/auth/forgot-password — solicitar recuperación
router.post('/forgot-password', PasswordResetController.forgotPassword);

// POST /api/v1/auth/reset-password — establecer nueva contraseña con token
router.post('/reset-password', PasswordResetController.resetPassword);

module.exports = router;
