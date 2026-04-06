const mysql = require("mysql2/promise");
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "bd_ecn1"
};

async function check() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [tables] = await connection.query("SHOW TABLES");
        console.log("Tablas en la BD:", tables.map(t => Object.values(t)[0]));

        const [cargosSchema] = await connection.query("DESCRIBE cargos");
        console.log("\nEsquema de cargos:", cargosSchema);

        const [relSchema] = await connection.query("DESCRIBE cargo_docente");
        console.log("\nEsquema de cargo_docente:", relSchema);
    } catch (err) {
        console.error("Error verificando tablas:", err.message);
    } finally {
        await connection.end();
    }
}

check();
