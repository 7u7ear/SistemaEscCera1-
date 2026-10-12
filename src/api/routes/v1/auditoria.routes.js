const express = require('express');
const router = express.Router();
const auditoriaController = require('../../controllers/auditoria.controller');
const authMiddleware = require('../../middlewares/auth');
const verificarPermiso = require('../../middlewares/permisos');

router.get(
    '/',
    authMiddleware,
    verificarPermiso('auditoria', 'lectura'),
    (req, res) => auditoriaController.getAll(req, res)
);

router.get(
    '/filtros',
    authMiddleware,
    verificarPermiso('auditoria', 'lectura'),
    (req, res) => auditoriaController.getFiltros(req, res)
);

module.exports = router;
