
const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bd_ecn1'
    });

    try {
        console.log("Creando tabla tramitaciones...");

        await connection.query(`
            CREATE TABLE IF NOT EXISTS tramitaciones (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                fecha DATE NOT NULL,
                tipo_tramite VARCHAR(100) NOT NULL,
                docente_id BIGINT UNSIGNED NULL,
                estado VARCHAR(20) DEFAULT 'pendiente',
                observaciones TEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL,
                created_by INT NULL,
                FOREIGN KEY (docente_id) REFERENCES docentes(id)
            ) ENGINE=InnoDB;
        `);

        console.log("Tabla tramitaciones creada exitosamente.");
    } catch (err) {
        console.error("Error en migración:", err.message);
    } finally {
        await connection.end();
    }
}

migrate();
