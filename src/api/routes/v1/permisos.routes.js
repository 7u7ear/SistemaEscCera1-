const express = require('express');
const router = express.Router();
const PermisoController = require('../../controllers/permiso.controller');
const auth = require('../../middlewares/auth');
const permisos = require('../../middlewares/permisos');

router.get('/matriz', auth, permisos('usuarios', 'lectura'), PermisoController.getMatriz);
router.post('/update', auth, permisos('usuarios', 'edicion'), PermisoController.updatePermiso);

module.exports = router;
