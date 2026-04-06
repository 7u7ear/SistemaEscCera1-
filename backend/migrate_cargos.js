const mysql = require("mysql2/promise");
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "bd_ecn1"
};

async function migrate() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        await connection.query("ALTER TABLE cargos ADD COLUMN deleted_by INT NULL AFTER deleted_at;");
        console.log("Columna deleted_by agregada a cargos.");
    } catch (err) {
        if (err.code === "ER_DUP_COLUMN_NAME") {
            console.log("La columna deleted_by ya existe en cargos.");
        } else {
            console.error("Error en la migración de cargos:", err);
        }
    } finally {
        await connection.end();
    }
}

migrate();
