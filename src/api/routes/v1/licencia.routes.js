const express = require('express');
const LicenciaController = require('../../controllers/licencia.controller');
const auth = require('../../middlewares/auth');
const permisoModulo = require('../../middlewares/permisos');

const router = express.Router();

router.use(auth);

// Sub-rutas específicas (PRIMERO)
router.get('/tipos', LicenciaController.getTipos);
router.post('/tipos', permisoModulo('docentes', 'edicion'), LicenciaController.createTipo);

// Rutas base
router.get('/', permisoModulo('docentes', 'lectura'), LicenciaController.getAll);
router.post('/', permisoModulo('docentes', 'edicion'), LicenciaController.create);

// Rutas por :id
router.put('/:id', permisoModulo('docentes', 'edicion'), LicenciaController.update);
router.delete('/:id', permisoModulo('docentes', 'edicion'), LicenciaController.delete);

module.exports = router;
