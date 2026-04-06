const express = require("express");
const db = require("../db");
const auth = require("../middlewares/auth");
const permisoModulo = require("../middlewares/permisos");

const router = express.Router();

// ============================
// LISTAR CARGOS (Solo activos)
// ============================

router.get("/",
    auth,
    permisoModulo("docentes", "lectura"),
    async (req, res) => {
        try {
            const [rows] = await db.query(`
                SELECT c.id, c.numero_puesto, c.tipo_cargo, c.total_horas, c.estado,
                       CONCAT(d.apellido, ' ', d.nombre) AS docente_nombre
                FROM cargos c
                LEFT JOIN cargo_docente cd ON c.id = cd.cargo_id AND cd.deleted_at IS NULL
                LEFT JOIN docentes d ON cd.docente_id = d.id AND d.deleted_at IS NULL
                WHERE c.deleted_at IS NULL
            `);
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

// ============================
// CREAR CARGO
// ============================

router.post("/",
    auth,
    permisoModulo("docentes", "edicion"),
    async (req, res) => {
        try {
            const { numero_puesto, tipo_cargo, total_horas } = req.body;

            if (!numero_puesto || !tipo_cargo) {
                return res.status(400).json("Número de puesto y tipo son obligatorios");
            }

            const [dup] = await db.query(
                "SELECT id FROM cargos WHERE numero_puesto = ? AND deleted_at IS NULL",
                [numero_puesto]
            );

            if (dup.length > 0) {
                return res.status(400).json("Ya existe un cargo con ese número de puesto");
            }

            await db.query(`
                INSERT INTO cargos (numero_puesto, tipo_cargo, total_horas, estado, created_at)
                VALUES (?, ?, ?, 'activo', NOW())
            `, [numero_puesto, tipo_cargo, total_horas || null]);

            res.json("Cargo creado");
        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

// ============================
// EDITAR CARGO
// ============================

router.put("/:id",
    auth,
    permisoModulo("docentes", "edicion"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { numero_puesto, tipo_cargo, total_horas, estado } = req.body;

            if (!numero_puesto || !tipo_cargo) {
                return res.status(400).json("Número de puesto y tipo son obligatorios");
            }

            const [dup] = await db.query(
                "SELECT id FROM cargos WHERE numero_puesto = ? AND id != ? AND deleted_at IS NULL",
                [numero_puesto, id]
            );

            if (dup.length > 0) {
                return res.status(400).json("Otro cargo ya tiene ese número de puesto");
            }

            await db.query(`
                UPDATE cargos SET 
                numero_puesto=?, tipo_cargo=?, total_horas=?, estado=?, updated_at=NOW()
                WHERE id=? AND deleted_at IS NULL
            `, [numero_puesto, tipo_cargo, total_horas || null, estado || 'activo', id]);

            res.json("Cargo actualizado");
        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

// ============================
// BORRADO LÓGICO
// ============================

router.delete("/:id",
    auth,
    permisoModulo("docentes", "edicion"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.session.user.id;

            await db.query(
                "UPDATE cargos SET deleted_at=NOW(), deleted_by=?, estado='inactivo' WHERE id=?",
                [userId, id]
            );

            res.json("Cargo eliminado");
        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

// ============================
// OBTENER HISTORIAL DEL CARGO
// ============================

router.get("/:id/historial",
    auth,
    async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await db.query(`
                SELECT cd.*, 
                       CONCAT(d.apellido, ' ', d.nombre) AS docente_nombre,
                       CONCAT(d2.apellido, ' ', d2.nombre) AS reemplaza_nombre
                FROM cargo_docente cd
                LEFT JOIN docentes d ON cd.docente_id = d.id
                LEFT JOIN cargo_docente cd2 ON cd.reemplaza_a = cd2.id
                LEFT JOIN docentes d2 ON cd2.docente_id = d2.id
                WHERE cd.cargo_id = ? AND cd.deleted_at IS NULL
                ORDER BY CASE 
                    WHEN cd.estado = 'activo' THEN 1 
                    WHEN cd.estado = 'licencia' THEN 2 
                    ELSE 3 
                END, cd.fecha_inicio DESC, cd.created_at DESC
            `, [id]);
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

// ============================
// ASIGNAR DOCENTE A CARGO
// ============================

router.post("/:id/asignar",
    auth,
    permisoModulo("docentes", "edicion"),
    async (req, res) => {
        try {
            console.log("---- Invocación a ASIGNAR DOCENTE ----");
            const { id } = req.params;
            const { docente_id, situacion_revista, fecha_inicio, reemplaza_a, rol, expediente_alta } = req.body;
            console.log("Cargo ID:", id, "Body:", req.body);

            if (!docente_id) return res.status(400).json("Docente es requerido");

            // Validaciones de Negocio:
            // 1. ¿Hay un titular activo?
            const [activos] = await db.query(
                "SELECT id, situacion_revista FROM cargo_docente WHERE cargo_id = ? AND estado = 'activo' AND deleted_at IS NULL",
                [id]
            );

            const titularActivo = activos.find(a => a.situacion_revista === 'titular');

            if (titularActivo && situacion_revista === 'interino') {
                return res.status(400).json("No se puede asignar un Interino porque ya existe un Titular activo en este Puesto.");
            }

            if (situacion_revista === 'suplente' && !reemplaza_a) {
                return res.status(400).json("Debe seleccionar a quién reemplaza el Suplente.");
            }

            // Lógica de inactivación
            if (reemplaza_a) {
                // El titular o suplente anterior pasa a 'licencia'
                await db.query(`
                    UPDATE cargo_docente
                    SET estado = 'licencia'
                    WHERE id = ? AND deleted_at IS NULL
                `, [reemplaza_a]);
            } else if (situacion_revista === 'titular') {
                // Si entra un nuevo titular, se inactivan los interinos o titulares previos
                await db.query(`
                    UPDATE cargo_docente
                    SET estado = 'inactivo', fecha_fin = ?
                    WHERE cargo_id = ? AND situacion_revista IN ('titular', 'interino', 'suplente') AND deleted_at IS NULL AND estado = 'activo'
                `, [fecha_inicio || null, id]);
            } else if (situacion_revista === 'interino') {
                // Si entra un interino (y no hay titular activo como validamos arriba), inactivamos otros interinos previos
                await db.query(`
                    UPDATE cargo_docente
                    SET estado = 'inactivo', fecha_fin = ?
                    WHERE cargo_id = ? AND situacion_revista = 'interino' AND deleted_at IS NULL AND estado = 'activo'
                `, [fecha_inicio || null, id]);
            }

            const sql = `
                INSERT INTO cargo_docente (docente_id, cargo_id, situacion_revista, fecha_inicio, reemplaza_a, estado, created_at, rol, expediente_alta)
                VALUES (?, ?, ?, ${fecha_inicio ? '?' : 'CURDATE()'}, ?, 'activo', NOW(), ?, ?)
            `;

            const params = [docente_id, id, situacion_revista || 'interino'];
            if (fecha_inicio) params.push(fecha_inicio);
            params.push(reemplaza_a || null);
            params.push(rol || 0);
            params.push(expediente_alta || null);

            await db.query(sql, params);

            res.json("Docente asignado correctamente");
        } catch (err) {
            console.error("Error al asignar docente:", err);
            res.status(500).json("Error en BD: " + err.message);
        }
    }
);

// ============================
// OBTENER DISTRIBUCIÓN DE HORAS
// ============================

router.get("/:id/distribucion",
    auth,
    async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await db.query(`
                SELECT dh.*, m.nombre as materia_nombre, 
                       c.anio as curso_anio, c.division as curso_division, 
                       c.modalidad as curso_modalidad, c.especialidad as curso_especialidad, c.turno as curso_turno
                FROM distribucion_horas dh
                JOIN materias m ON dh.materia_id = m.id
                LEFT JOIN cursos c ON dh.curso_id = c.id
                WHERE dh.cargo_id = ? AND dh.deleted_at IS NULL
            `, [id]);
            res.json(rows);
        } catch (err) {
            console.error(err);
            res.status(500).json("Error en BD");
        }
    }
);

// ============================
// GUARDAR DISTRIBUCIÓN
// ============================

router.post("/:id/distribucion",
    auth,
    permisoModulo("docentes", "edicion"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { materia_id, cantidad_horas, tipo, dia, hora_ingreso, hora_egreso, curso_id } = req.body;

            if (!materia_id || !cantidad_horas || !curso_id) {
                return res.status(400).json("Materia, Curso y Horas son obligatorios");
            }

            // Defaults: 'clase', 'lunes', etc si no lo mandan para que no rompa la constraint de Enum
            const insertTipo = tipo || 'clase';
            const insertDia = dia || 'lunes';

            await db.query(`
                INSERT INTO distribucion_horas (cargo_id, materia_id, curso_id, cantidad_horas, tipo, dia, hora_ingreso, hora_egreso, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [id, materia_id, curso_id, cantidad_horas, insertTipo, insertDia, hora_ingreso || null, hora_egreso || null]);

            res.json("Distribución guardada");
        } catch (err) {
            console.error("Error al guardar distribución:", err);
            res.status(500).json("Error en BD: " + err.message);
        }
    }
);

// ============================
// DAR DE BAJA A UN DOCENTE DEL CARGO
// ============================

router.post("/:id/baja/:cargo_docente_id",
    auth,
    permisoModulo("docentes", "edicion"),
    async (req, res) => {
        try {
            const { id, cargo_docente_id } = req.params;
            const { fecha_fin, expediente_baja, titular_regresa } = req.body;

            // Format fecha_fin if present, else use CURDATE()
            const sqlFecha = fecha_fin ? "?" : "CURDATE()";
            const params = fecha_fin ? [fecha_fin, expediente_baja || null, cargo_docente_id, id] : [expediente_baja || null, cargo_docente_id, id];

            await db.query(`
                UPDATE cargo_docente
                SET estado = 'inactivo', fecha_fin = ${sqlFecha}, expediente_baja = ?
                WHERE id = ? AND cargo_id = ? AND deleted_at IS NULL
            `, params);

            // NUEVA LÓGICA DE SUCESIÓN/INTEGRACIÓN:
            // Si NO regresa el titular (es una baja definitiva o renuncia), 
            // buscamos si hay suplentes que necesiten cambio de revista.
            if (!titular_regresa) {
                // 1. Obtener datos del docente que se va y el cargo
                const [infoDocente] = await db.query(`
                    SELECT cd.situacion_revista, CONCAT(d.apellido, ' ', d.nombre) as nombre, c.numero_puesto
                    FROM cargo_docente cd
                    JOIN docentes d ON cd.docente_id = d.id
                    JOIN cargos c ON cd.cargo_id = c.id
                    WHERE cd.id = ?
                `, [cargo_docente_id]);

                if (infoDocente.length > 0) {
                    const { situacion_revista, nombre, numero_puesto } = infoDocente[0];

                    // 2. Buscar si hay suplentes activos para este cargo
                    const [suplentes] = await db.query(`
                        SELECT cd.id, cd.docente_id, CONCAT(d.apellido, ' ', d.nombre) as nombre_suplente
                        FROM cargo_docente cd
                        JOIN docentes d ON cd.docente_id = d.id
                        WHERE cd.cargo_id = ? AND cd.estado IN ('activo', 'licencia') 
                        AND cd.situacion_revista = 'suplente' AND cd.deleted_at IS NULL
                    `, [id]);

                    if (suplentes.length > 0) {
                        // 3. Crear trámite automático de alerta
                        const userId = req.session.user.id;
                        const obsAuto = `ALERTA AUTOMÁTICA: El ${situacion_revista} ${nombre} se dio de baja definitiva del puesto ${numero_puesto}. 
                                        Hay ${suplentes.length} suplente(s) en cadena (Primer suplente: ${suplentes[0].nombre_suplente}). 
                                        SE REQUIERE CAMBIO DE SITUACIÓN DE REVISTA (CARATULAR).`;

                        await db.query(`
                            INSERT INTO tramitaciones (fecha, docente_id, cargo_id, expediente, estado, observaciones, created_by)
                            VALUES (CURDATE(), ?, ?, ?, 'caratulado', ?, ?)
                        `, [suplentes[0].docente_id, id, expediente_baja || null, obsAuto, userId]);
                        
                        console.log("---- Trámite de Sucesión generado automáticamente ----");
                    }
                }
            } else {
                // Lógica original: Si el titular regresa, reactivamos al reemplazado
                const [rows] = await db.query("SELECT reemplaza_a FROM cargo_docente WHERE id = ?", [cargo_docente_id]);
                if (rows.length > 0 && rows[0].reemplaza_a) {
                    await db.query("UPDATE cargo_docente SET estado = 'activo' WHERE id = ?", [rows[0].reemplaza_a]);
                }
            }

            res.json("Baja registrada correctamente");
        } catch (err) {
            console.error("Error en baja:", err);
            res.status(500).json("Error en BD: " + err.message);
        }
    }
);

module.exports = router;
