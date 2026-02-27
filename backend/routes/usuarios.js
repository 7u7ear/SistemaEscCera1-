const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM usuarios");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json("Error en BD");
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const [rows] = await db.query(
        "SELECT * FROM usuarios WHERE username=?",
        [username]
    );

    if (rows.length === 0)
        return res.status(401).json("Usuario no existe");

    const user = rows[0];

    if (user.estado !== "activo")
        return res.status(403).json("Usuario pendiente");

    const match = await bcrypt.compare(password, user.password);

    if (!match)
        return res.status(401).json("Password incorrecto");

    req.session.user = user;

    res.json("Login correcto");
});

router.get("/me", (req, res) => {
    if (!req.session.user)
        return res.status(401).json("No logueado");

    const { password, ...userSafe } = req.session.user;
    res.json(userSafe);
});

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json("Logout correcto");
    });
});

module.exports = router;