const express = require('express');
const CursoController = require('../../controllers/curso.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', CursoController.getAll);

module.exports = router;
