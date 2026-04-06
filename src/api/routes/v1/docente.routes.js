const express = require('express');
const DocenteController = require('../../controllers/docente.controller');
const auth = require('../../middlewares/auth');
const permisoModulo = require('../../middlewares/permisos');

const router = express.Router();

router.use(auth);

router.get('/', permisoModulo('docentes', 'lectura'), DocenteController.getAll);
router.post('/', permisoModulo('docentes', 'edicion'), DocenteController.create);
router.put('/:id', permisoModulo('docentes', 'edicion'), DocenteController.update);
router.delete('/:id', permisoModulo('docentes', 'edicion'), DocenteController.delete);

router.get('/:id/cargos', permisoModulo('docentes', 'lectura'), DocenteController.getCargos);

module.exports = router;
