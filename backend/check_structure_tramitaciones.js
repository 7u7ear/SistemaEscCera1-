const mysql = require("mysql2/promise");
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "bd_ecn1"
};

async function testSchema() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Conectado a bd_ecn1.");

        try {
            const [schema] = await connection.query("DESCRIBE distribucion_horas");
            console.log("\nEsquema de la tabla distribucion_horas:");
            console.table(schema);
        } catch (e) { console.log("\nError al leer distribucion_horas:", e.message); }

        try {
            const [rows] = await connection.query("SELECT * FROM distribucion_horas LIMIT 5");
            console.log(`\nDatos en distribucion_horas:`);
            console.log(rows);
        } catch (e) { console.log("\nError al leer datos distribucion_horas:", e.message); }

        try {
            const [schema] = await connection.query("DESCRIBE cargos");
            console.log("\nEsquema de la tabla cargos:");
            console.table(schema);
        } catch (e) { console.log("\nError al leer cargos:", e.message); }

        try {
            const [schema] = await connection.query("DESCRIBE cargo_docente");
            console.log("\nEsquema de la tabla cargo_docente:");
            console.table(schema);
        } catch (e) { console.log("\nError al leer cargo_docente:", e.message); }

        await connection.end();
    } catch (error) {
        console.error("Error conectando a la base de datos:", error.message);
    }
}

testSchema();
