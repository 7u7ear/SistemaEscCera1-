const express = require("express");
const db = require("../db");
const auth = require("../middlewares/auth");

const router = express.Router();

// Listar todas las materias
router.get("/", auth, async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM materias ORDER BY nombre ASC");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

module.exports = router;
