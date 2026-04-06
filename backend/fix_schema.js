
const mysql = require('mysql2/promise');

async function fix() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bd_ecn1'
    });

    try {
        console.log("Iniciando corrección de esquema...");

        // 1. Asegurar tabla materias
        await connection.query(`
            CREATE TABLE IF NOT EXISTS materias (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(191) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL
            ) ENGINE=InnoDB;
        `);
        console.log("- Tabla materias lista.");

        // 2. Asegurar tabla cargo_docente
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cargo_docente (
                id INT AUTO_INCREMENT PRIMARY KEY,
                docente_id BIGINT UNSIGNED NOT NULL,
                cargo_id INT NOT NULL,
                situacion_revista VARCHAR(50) DEFAULT 'interino',
                fecha_inicio DATE NULL,
                fecha_fin DATE NULL,
                estado VARCHAR(20) DEFAULT 'activo',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NULL,
                deleted_at TIMESTAMP NULL
            ) ENGINE=InnoDB;
        `);

        // Verificar columnas individuales por si la tabla ya existía
        const [cols] = await connection.query("DESCRIBE cargo_docente");
        const colNames = cols.map(c => c.Field);

        if (!colNames.includes('estado')) {
            await connection.query("ALTER TABLE cargo_docente ADD COLUMN estado VARCHAR(20) DEFAULT 'activo'");
            console.log("-- Columna estado añadida a cargo_docente");
        }
        if (!colNames.includes('deleted_at')) {
            await connection.query("ALTER TABLE cargo_docente ADD COLUMN deleted_at TIMESTAMP NULL");
            console.log("-- Columna deleted_at añadida a cargo_docente");
        }

        // 3. Asegurar tabla distribucion_horas
        await connection.query(`
            CREATE TABLE IF NOT EXISTS distribucion_horas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cargo_id INT NOT NULL,
                materia_id INT NOT NULL,
                horas INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL
            ) ENGINE=InnoDB;
        `);
        console.log("- Tabla distribucion_horas lista.");

        console.log("Esquema corregido exitosamente.");
    } catch (err) {
        console.error("Error al corregir esquema:", err.message);
    } finally {
        await connection.end();
    }
}

fix();
