const express = require("express");
const db = require("../db");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, codigo, descripcion_tramite AS descripcion, activo FROM codigo_tramites WHERE activo = 1 ORDER BY codigo");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const { codigo, descripcion } = req.body;
        console.log("Intentando crear código:", { codigo, descripcion });
        if (!codigo || !descripcion) return res.status(400).json("Código y descripción son obligatorios");

        const [result] = await db.query("INSERT INTO codigo_tramites (codigo, descripcion_tramite, activo) VALUES (?, ?, 1)", [codigo, descripcion]);
        console.log("Resultado inserción:", result);
        res.json("Código de trámite creado");
    } catch (err) {
        console.error("Error en POST /codigos-tramite:", err.message);
        res.status(500).json(err.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo, descripcion } = req.body;
        await db.query("UPDATE codigo_tramites SET codigo = ?, descripcion_tramite = ? WHERE id = ?", [codigo, descripcion, id]);
        res.json("Código de trámite actualizado");
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE codigo_tramites SET activo = 0 WHERE id = ?", [id]);
        res.json("Código de trámite desactivado");
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

module.exports = router;
