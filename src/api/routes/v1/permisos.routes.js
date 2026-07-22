const express = require('express');
const router = express.Router();
const PermisoController = require('../../controllers/permiso.controller');
const auth = require('../../middlewares/auth');
const permisos = require('../../middlewares/permisos');

router.get('/matriz', auth, permisos('permisos', 'lectura'), PermisoController.getMatriz);
router.post('/update', auth, permisos('permisos', 'edicion'), PermisoController.updatePermiso);

module.exports = router;
