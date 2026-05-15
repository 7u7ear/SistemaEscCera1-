const express = require('express');
const router = express.Router();
const db = require('../../../../config/database');
const auth = require('../../middlewares/auth');
const permisos = require('../../middlewares/permisos');

// Obtener matriz completa (Perfiles x Módulos)
router.get('/matriz', auth, permisos('usuarios', 'lectura'), async (req, res, next) => {
    try {
        const [perfiles] = await db.query("SELECT id, nombre FROM perfiles");
        const [modulos] = await db.query("SELECT id, nombre FROM modulos");
        const [permisos] = await db.query("SELECT perfil_id, modulo_id, permiso FROM perfil_modulo");

        res.json({ perfiles, modulos, permisos });
    } catch (err) {
        next(err);
    }
});

// Actualizar un permiso específico
router.post('/update', auth, permisos('usuarios', 'edicion'), async (req, res, next) => {
    try {
        const { perfil_id, modulo_id, permiso } = req.body;
        
        await db.query(`
            INSERT INTO perfil_modulo (perfil_id, modulo_id, permiso) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE permiso = ?
        `, [perfil_id, modulo_id, permiso, permiso]);

        res.json({ message: "Permiso actualizado correctamente" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
