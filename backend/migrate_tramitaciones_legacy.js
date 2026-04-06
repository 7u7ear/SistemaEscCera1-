
const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bd_ecn1'
    });

    try {
        console.log("Renombrando tabla tramitaciones existente...");
        // Intentar renombrar por seguridad
        await connection.query("RENAME TABLE tramitaciones TO tramitaciones_legacy");
        console.log("Tabla renombrada a tramitaciones_legacy.");

        console.log("Creando nueva tabla tramitaciones...");
        await connection.query(`
            CREATE TABLE tramitaciones (
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

        console.log("Nueva tabla tramitaciones creada exitosamente.");
    } catch (err) {
        if (err.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log("La tabla ya tiene el formato nuevo o hubo un error previo.");
        } else {
            console.error("Error en migración:", err.message);
        }
    } finally {
        await connection.end();
    }
}

migrate();
