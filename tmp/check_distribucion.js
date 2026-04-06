const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'bd_ecn1'
    });

    try {
        const [cols] = await connection.query("DESCRIBE distribucion_horas");
        console.log("COLUMNS IN distribucion_horas:");
        console.log(JSON.stringify(cols, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await connection.end();
    }
}

check();
