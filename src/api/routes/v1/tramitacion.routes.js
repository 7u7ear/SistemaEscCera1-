const express = require('express');
const TramitacionController = require('../../controllers/tramitacion.controller');
const auth = require('../../middlewares/auth');
const permisoModulo = require('../../middlewares/permisos');

const router = express.Router();

router.use(auth);

router.get('/', permisoModulo('tramitaciones', 'lectura'), TramitacionController.getAll);
router.post('/', permisoModulo('tramitaciones', 'edicion'), TramitacionController.create);
router.put('/:id', permisoModulo('tramitaciones', 'edicion'), TramitacionController.update);
router.delete('/:id', permisoModulo('tramitaciones', 'edicion'), TramitacionController.delete);

module.exports = router;
