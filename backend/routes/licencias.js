const express = require("express");
const db = require("../db");
const auth = require("../middlewares/auth");
const permisoModulo = require("../middlewares/permisos");

const router = express.Router();

// Listar licencias vigentes/recientes
router.get("/", auth, permisoModulo("docentes", "lectura"), async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT l.*, 
                   CONCAT(d.apellido, ' ', d.nombre) AS docente_nombre,
                   c.numero_puesto, c.tipo_cargo,
                   t.estado AS tramite_estado, t.id AS tramite_id
            FROM licencias l
            JOIN docentes d ON l.docente_id = d.id
            LEFT JOIN cargos c ON l.cargo_id = c.id
            LEFT JOIN tramitaciones t ON l.tramitacion_id = t.id
            WHERE l.deleted_at IS NULL
            ORDER BY l.fecha_inicio DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

// Crear licencia (soporta múltiples cargos)
router.post("/", auth, permisoModulo("docentes", "edicion"), async (req, res) => {
    try {
        const { 
            docente_id, cargo_ids, fecha_inicio, fecha_fin, tipo_licencia, 
            corresponde_expediente, expediente, observaciones, actualizar_puesto,
            generar_tramite, codigo_tramite_id 
        } = req.body;

        const userId = req.session.user.id;
        let tramitacionId = null;

        // 1. Si se solicita, crear la tramitación inicial
        if (generar_tramite && codigo_tramite_id) {
            const [tResult] = await db.query(`
                INSERT INTO tramitaciones (fecha, docente_id, expediente, codigo_tramite_id, estado, observaciones, created_by)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [fecha_inicio, docente_id, expediente || null, codigo_tramite_id, 'caratulado', `Trámite generado automáticamente por registro de licencia: ${tipo_licencia}`, userId]);
            tramitacionId = tResult.insertId;
        }

        // Si no hay cargo_ids, es una licencia general (cargo_id = null)
        const targets = (!cargo_ids || cargo_ids.length === 0) ? [null] : cargo_ids;

        for (const cid of targets) {
            // 2. Insertar licencia vinculada al trámite (si existe)
            await db.query(`
                INSERT INTO licencias (docente_id, cargo_id, tramitacion_id, fecha_inicio, fecha_fin, tipo_licencia, corresponde_expediente, expediente, observaciones)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [docente_id, cid, tramitacionId, fecha_inicio, fecha_fin || null, tipo_licencia, corresponde_expediente ? 1 : 0, expediente || null, observaciones || null]);

            // 3. Si se solicita, actualizar el estado del docente en el puesto a 'licencia'
            if (actualizar_puesto && cid && docente_id) {
                await db.query(`
                    UPDATE cargo_docente 
                    SET estado = 'licencia' 
                    WHERE cargo_id = ? AND docente_id = ? AND estado = 'activo'
                `, [cid, docente_id]);
            }
        }

        res.json({ mensaje: "Licencia registrada correctamente", tramitacion_id: tramitacionId });
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

// Eliminar licencia (borrado lógico)
router.delete("/:id", auth, permisoModulo("docentes", "edicion"), async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE licencias SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", [id]);
        res.json("Licencia eliminada");
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

// Crear nuevo tipo de licencia
router.post("/tipos", auth, permisoModulo("docentes", "edicion"), async (req, res) => {
    try {
        const { cod_licencia, descripcion } = req.body;
        if (!cod_licencia || !descripcion) return res.status(400).json("Código y descripción obligatorios");

        await db.query("INSERT INTO cod_lic (cod_licencia, descripcion) VALUES (?, ?)", [cod_licencia, descripcion]);
        res.json("Tipo de licencia creado");
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

// Listar tipos de licencia (códigos)
router.get("/tipos", auth, async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM cod_lic WHERE activo = 1 ORDER BY cod_licencia");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

// Actualizar licencia o finalizarla
router.put("/:id", auth, permisoModulo("docentes", "edicion"), async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_inicio, fecha_fin, tipo_licencia, corresponde_expediente, expediente, observaciones, finalizar_puesto } = req.body;

        const [rows] = await db.query("SELECT docente_id, cargo_id FROM licencias WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json("Licencia no encontrada");
        const { docente_id, cargo_id } = rows[0];

        await db.query(`
            UPDATE licencias 
            SET fecha_inicio = ?, fecha_fin = ?, tipo_licencia = ?, corresponde_expediente = ?, expediente = ?, observaciones = ?
            WHERE id = ?
        `, [fecha_inicio, fecha_fin || null, tipo_licencia, corresponde_expediente ? 1 : 0, expediente || null, observaciones || null, id]);

        if (finalizar_puesto && cargo_id && docente_id) {
            await db.query(`
                UPDATE cargo_docente 
                SET estado = 'activo' 
                WHERE cargo_id = ? AND docente_id = ? AND estado = 'licencia'
            `, [cargo_id, docente_id]);
        }

        res.json("Licencia actualizada correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

module.exports = router;
