
const mysql = require('mysql2/promise');

async function fix() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bd_ecn1'
    });

    try {
        console.log("Insertando módulo tramitaciones...");
        const [modRes] = await connection.query("INSERT IGNORE INTO modulos (nombre) VALUES ('tramitaciones')");

        const [modRows] = await connection.query("SELECT id FROM modulos WHERE nombre = 'tramitaciones'");
        const modId = modRows[0].id;
        console.log("Módulo ID:", modId);

        console.log("Asignando permisos a todos los usuarios...");
        const [users] = await connection.query("SELECT id FROM usuarios");

        for (const user of users) {
            await connection.query(`
                INSERT IGNORE INTO usuario_modulo (usuario_id, modulo_id, permiso)
                VALUES (?, ?, 'edicion')
            `, [user.id, modId]);
        }

        console.log("Permisos asignados correctamente.");
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await connection.end();
    }
}

fix();
