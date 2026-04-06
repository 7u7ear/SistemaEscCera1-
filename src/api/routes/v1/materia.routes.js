const express = require('express');
const MateriaController = require('../../controllers/materia.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', MateriaController.getAll);

module.exports = router;
