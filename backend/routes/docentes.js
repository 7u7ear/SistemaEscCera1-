const express = require("express");
const db = require("../db");
const auth = require("../middlewares/auth");
const permisoModulo = require("../middlewares/permisos");

const router = express.Router();

// ============================
// LISTAR DOCENTES
// ============================

router.get("/",
    auth,
    permisoModulo("docentes", "lectura"),
    async (req, res) => {
        try {

            const [rows] = await db.query(`
                SELECT id, rrhh_id, apellido, nombre, email, estado
                FROM docentes
                WHERE deleted_at IS NULL OR deleted_at IS NULL
            `);

            res.json(rows);

        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

// ============================
// CREAR DOCENTE
// ============================

router.post("/",
    auth,
    permisoModulo("docentes", "edicion"),
    async (req, res) => {

        try {

            const {
                rrhh_id,
                apellido,
                nombre,
                fechaNac,
                dni,
                cuil,
                fichaCensal,
                email,
                direccion,
                telefono,
                fecha_ingreso
            } = req.body;

            if (!apellido || !nombre) {
                return res.status(400).json("Apellido y nombre son obligatorios");
            }

            await db.query(`
                INSERT INTO docentes
                (rrhh_id, apellido, nombre, fechaNac, dni, cuil, fichaCensal, email, direccion, telefono, fecha_ingreso, estado)
                VALUES (?,?,?,?,?,?,?,?,?,?,?, 'activo')
            `,
            [
                rrhh_id || null,
                apellido,
                nombre,
                fechaNac || null,
                dni || null,
                cuil || null,
                fichaCensal || null,
                email || null,
                direccion || null,
                telefono || null,
                fecha_ingreso || null
            ]);

            res.json("Docente creado");

        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

module.exports = router;