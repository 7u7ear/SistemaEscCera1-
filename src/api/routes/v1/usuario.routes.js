const express = require('express');
const UsuarioController = require('../../controllers/usuario.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/login', UsuarioController.login);
router.post('/logout', auth, UsuarioController.logout);
router.get('/me', auth, UsuarioController.getMe);
router.get('/', auth, UsuarioController.getAll);

module.exports = router;
