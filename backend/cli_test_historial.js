const db = require("./db");

async function testHistorial() {
    try {
        const [rows] = await db.query(`
                SELECT cd.*, 
                       CONCAT(d.apellido, ' ', d.nombre) AS docente_nombre
                FROM cargo_docente cd
                LEFT JOIN docentes d ON cd.docente_id = d.id
                WHERE cd.cargo_id = ? AND cd.deleted_at IS NULL
                ORDER BY cd.fecha_inicio DESC, cd.created_at DESC
            `, [1]);
        console.log("Filas:", rows);
    } catch (err) {
        console.error("ERROR SQL:", err);
    }
    process.exit(0);
}
testHistorial();
