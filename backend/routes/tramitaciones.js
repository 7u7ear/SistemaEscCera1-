const express = require("express");
const db = require("../db");
const auth = require("../middlewares/auth");
const permisoModulo = require("../middlewares/permisos");

const router = express.Router();

// Listar tramitaciones
router.get("/", auth, permisoModulo("tramitaciones", "lectura"), async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, 
                   CONCAT(d.apellido, ' ', d.nombre) AS docente_nombre,
                   ct.codigo AS tramite_codigo, ct.descripcion_tramite AS tramite_descripcion,
                   c.numero_puesto, c.tipo_cargo
            FROM tramitaciones t
            LEFT JOIN docentes d ON t.docente_id = d.id
            LEFT JOIN codigo_tramites ct ON t.codigo_tramite_id = ct.id
            LEFT JOIN cargos c ON t.cargo_id = c.id
            WHERE t.deleted_at IS NULL
            ORDER BY t.fecha DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

// Crear tramitación
router.post("/", auth, permisoModulo("tramitaciones", "edicion"), async (req, res) => {
    try {
        const { fecha, docente_id, rol, expediente, cargo_id, codigo_tramite_id, estado, observaciones } = req.body;
        const userId = req.session.user.id;

        await db.query(`
            INSERT INTO tramitaciones (fecha, docente_id, rol, expediente, cargo_id, codigo_tramite_id, estado, observaciones, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [fecha, docente_id || null, rol || null, expediente || null, cargo_id || null, codigo_tramite_id || null, estado || 'caratulado', observaciones || null, userId]);

        res.json("Tramitación registrada");
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

// Actualizar tramitación
router.put("/:id", auth, permisoModulo("tramitaciones", "edicion"), async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, docente_id, rol, expediente, cargo_id, codigo_tramite_id, estado, observaciones } = req.body;

        await db.query(`
            UPDATE tramitaciones 
            SET fecha = ?, docente_id = ?, rol = ?, expediente = ?, cargo_id = ?, codigo_tramite_id = ?, estado = ?, observaciones = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [fecha, docente_id || null, rol || null, expediente || null, cargo_id || null, codigo_tramite_id || null, estado, observaciones || null, id]);

        res.json("Tramitación actualizada");
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

// Eliminar tramitación (borrado lógico)
router.delete("/:id", auth, permisoModulo("tramitaciones", "edicion"), async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE tramitaciones SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", [id]);
        res.json("Tramitación eliminada");
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

module.exports = router;
