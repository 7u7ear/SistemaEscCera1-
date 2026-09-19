const express = require('express');
const CursoController = require('../../controllers/curso.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', CursoController.getAll);
router.get('/:id/horario', CursoController.getHorario);

router.get('/:id/preceptor', CursoController.getPreceptor);
router.post('/:id/preceptor', CursoController.assignPreceptor);

module.exports = router;
