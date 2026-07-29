const express = require('express');
const BloqueHorarioController = require('../../controllers/bloque_horario.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', BloqueHorarioController.getPorTurno);

module.exports = router;
