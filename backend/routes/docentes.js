const express = require("express");
const db = require("../db");
const auth = require("../middlewares/auth");
const permisoModulo = require("../middlewares/permisos");

const router = express.Router();

// ============================
// LISTAR DOCENTES (Solo activos)
// ============================

router.get("/",
    auth,
    permisoModulo("docentes", "lectura"),
    async (req, res) => {
        try {
            const [rows] = await db.query(`
                SELECT id, rrhh_id, apellido, nombre, fechaNac, dni, cuil, fichaCensal, email, direccion, telefono, fecha_ingreso, estado
                FROM docentes
                WHERE deleted_at IS NULL
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
            const { rrhh_id, apellido, nombre, fechaNac, dni, cuil, fichaCensal, email, direccion, telefono, fecha_ingreso } = req.body;

            if (!apellido || !nombre || !dni || !cuil || !rrhh_id) {
                return res.status(400).json("Campos obligatorios faltantes");
            }

            // Validar duplicados (RRHH_ID, DNI, CUIL) en registros no borrados
            const [dup] = await db.query(
                "SELECT id FROM docentes WHERE (rrhh_id = ? OR dni = ? OR cuil = ?) AND deleted_at IS NULL",
                [rrhh_id, dni, cuil]
            );

            if (dup.length > 0) {
                return res.status(400).json("Ya existe un docente con ese RRHH ID, DNI o CUIL");
            }

            await db.query(`
                INSERT INTO docentes
                (rrhh_id, apellido, nombre, fechaNac, dni, cuil, fichaCensal, email, direccion, telefono, fecha_ingreso, estado, created_at)
                VALUES (?,?,?,?,?,?,?,?,?,?,?, 'activo', NOW())
            `, [rrhh_id, apellido, nombre, fechaNac || null, dni, cuil, fichaCensal || null, email || null, direccion || null, telefono || null, fecha_ingreso || null]);

            res.json("Docente creado");
        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

// ============================
// EDITAR DOCENTE
// ============================

router.put("/:id",
    auth,
    permisoModulo("docentes", "edicion"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { rrhh_id, apellido, nombre, fechaNac, dni, cuil, fichaCensal, email, direccion, telefono, fecha_ingreso, estado } = req.body;

            if (!apellido || !nombre || !dni || !cuil || !rrhh_id) {
                return res.status(400).json("Campos obligatorios faltantes");
            }

            // Validar duplicados excluyendo el ID actual
            const [dup] = await db.query(
                "SELECT id FROM docentes WHERE (rrhh_id = ? OR dni = ? OR cuil = ?) AND id != ? AND deleted_at IS NULL",
                [rrhh_id, dni, cuil, id]
            );

            if (dup.length > 0) {
                return res.status(400).json("Otro docente ya tiene ese RRHH ID, DNI o CUIL");
            }

            await db.query(`
                UPDATE docentes SET
                rrhh_id=?, apellido=?, nombre=?, fechaNac=?, dni=?, cuil=?, fichaCensal=?, email=?, direccion=?, telefono=?, fecha_ingreso=?, estado=?, updated_at=NOW()
                WHERE id=? AND deleted_at IS NULL
            `, [rrhh_id, apellido, nombre, fechaNac || null, dni, cuil, fichaCensal || null, email || null, direccion || null, telefono || null, fecha_ingreso || null, estado || 'activo', id]);

            res.json("Docente actualizado");
        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

// ============================
// BORRADO LÓGICO (Soft Delete)
// ============================

router.delete("/:id",
    auth,
    permisoModulo("docentes", "edicion"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.session.user.id;

            await db.query(
                "UPDATE docentes SET deleted_at=NOW(), deleted_by=?, estado='inactivo' WHERE id=?",
                [userId, id]
            );

            res.json("Docente eliminado (borrado lógico)");
        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

// ============================
// VER CARGOS DE UN DOCENTE
// ============================

router.get("/:id/cargos",
    auth,
    permisoModulo("docentes", "lectura"),
    async (req, res) => {
        try {
            const { id } = req.params;
            console.log(`[DEBUG] Buscando cargos para docente_id: ${id}`);
            const [rows] = await db.query(`
                SELECT c.id AS cargo_id, c.numero_puesto, c.tipo_cargo, cd.situacion_revista, cd.fecha_inicio
                FROM cargo_docente cd
                JOIN cargos c ON cd.cargo_id = c.id
                WHERE cd.docente_id = ? AND cd.deleted_at IS NULL AND c.deleted_at IS NULL AND cd.estado IN ('activo', 'licencia')
            `, [id]);
            console.log(`[DEBUG] Se encontraron ${rows.length} cargos para el docente ${id}`);
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

module.exports = router;