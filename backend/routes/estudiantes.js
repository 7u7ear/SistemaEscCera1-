const express = require("express");
const auth = require("../middlewares/auth");
const permisoModulo = require("../middlewares/permisos");

const router = express.Router();

router.get("/",
    auth,
    permisoModulo("estudiantes", "edicion"),
    (req, res) => {
        res.json("Modulo estudiantes permitido");
    }
);

module.exports = router;