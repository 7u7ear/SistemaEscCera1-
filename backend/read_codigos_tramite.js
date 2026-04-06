const mysql = require("mysql2/promise");
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "bd_ecn1"
};

async function readCodigosTramite() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Conectado a bd_ecn1.");

        const [rows] = await connection.query("SELECT * FROM codigos_tramite");
        console.log(`\nSe encontraron ${rows.length} códigos de trámite:`);
        console.table(rows);

        await connection.end();
    } catch (error) {
        console.error("Error conectando a la base de datos:", error.message);
    }
}

readCodigosTramite();
