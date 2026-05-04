const db = require('./config/database');

async function createAuditoriaTable() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS auditoria (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                accion VARCHAR(50) NOT NULL,
                entidad VARCHAR(50) NOT NULL,
                entidad_id INT,
                detalles JSON,
                creado_el TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Tabla auditoria creada exitosamente");
        process.exit(0);
    } catch (error) {
        console.error("Error creando tabla auditoria:", error);
        process.exit(1);
    }
}

createAuditoriaTable();
