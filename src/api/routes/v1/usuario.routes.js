const express = require('express');
const UsuarioController = require('../../controllers/usuario.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/login', UsuarioController.login);
router.post('/register', UsuarioController.register);
router.post('/logout', auth, UsuarioController.logout);
router.get('/me', auth, UsuarioController.getMe);
router.get('/perfiles', auth, UsuarioController.getPerfiles);
router.get('/', auth, UsuarioController.getAll);

// Rutas Administrativas
const permisos = require('../../middlewares/permisos');
router.patch('/:id/status', auth, permisos('usuarios', 'edicion'), UsuarioController.updateStatus);
router.patch('/:id/perfil', auth, permisos('usuarios', 'edicion'), UsuarioController.updatePerfil);
router.post('/admin-create', auth, permisos('usuarios', 'edicion'), UsuarioController.adminCreate);

module.exports = router;
