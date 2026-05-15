const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function importDatabase() {
    console.log("Iniciando conexión a Aiven...");
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            multipleStatements: true, // Necesario para ejecutar el .sql completo
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        console.log("Conectado exitosamente a Aiven.");

        const sqlFilePath = path.join(__dirname, '../database/bd_ecn1.sql');
        console.log(`Leyendo archivo: ${sqlFilePath}`);
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        console.log("Ejecutando importación... esto puede tardar unos segundos.");
        await connection.query(sql);

        console.log("✅ Importación completada con éxito en Aiven.");
    } catch (err) {
        console.error("❌ Error durante la importación:");
        console.error(err.message);
    } finally {
        if (connection) {
            await connection.end();
            console.log("Conexión cerrada.");
        }
        process.exit();
    }
}

importDatabase();
