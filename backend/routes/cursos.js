const express = require("express");
const db = require("../db");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const [rows] = await db.query("SELECT id, anio, division, modalidad, especialidad, turno FROM cursos WHERE deleted_at IS NULL ORDER BY anio, division");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

module.exports = router;
