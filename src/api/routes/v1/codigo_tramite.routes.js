const express = require('express');
const CodigoTramiteController = require('../../controllers/codigo_tramite.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.use(auth);

router.get('/', CodigoTramiteController.getAll);
router.post('/', CodigoTramiteController.create);
router.put('/:id', CodigoTramiteController.update);
router.delete('/:id', CodigoTramiteController.delete);

module.exports = router;
