const express = require('express');
const PlanillaController = require('../../controllers/planilla.controller');
const auth = require('../../middlewares/auth');
const permisoModulo = require('../../middlewares/permisos');

const router = express.Router();

router.use(auth);

// Se requiere al menos lectura de 'docentes' para ver la planilla
router.get('/',
    permisoModulo('docentes', 'lectura'),
    PlanillaController.getPlanilla
);

module.exports = router;
