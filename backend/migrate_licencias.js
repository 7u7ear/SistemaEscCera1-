const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bd_ecn1'
};

async function migrate() {
    const connection = await mysql.createConnection(dbConfig);
    try {
        console.log("Limpiando tabla lidencias...");
        await connection.query("DROP TABLE IF EXISTS licencias");

        console.log("Creando tabla licencias...");
        await connection.query(`
            CREATE TABLE licencias (
                id INT AUTO_INCREMENT PRIMARY KEY,
                docente_id INT NOT NULL,
                cargo_id BIGINT UNSIGNED NULL,
                fecha_inicio DATE NOT NULL,
                fecha_fin DATE NULL,
                tipo_licencia VARCHAR(100) NOT NULL,
                corresponde_expediente TINYINT(1) DEFAULT 0,
                expediente VARCHAR(100) NULL,
                observaciones TEXT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL
            ) ENGINE=InnoDB;
        `);

        console.log("Creando tabla cod_lic...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cod_lic (
                id INT AUTO_INCREMENT PRIMARY KEY,
                cod_licencia VARCHAR(50) NOT NULL,
                descripcion VARCHAR(255) NOT NULL,
                activo TINYINT(1) DEFAULT 1
            )
        `);
        const [counts] = await connection.query("SELECT COUNT(*) as count FROM cod_lic");
        if (counts[0].count === 0) {
            await connection.query(`
                INSERT INTO cod_lic (cod_licencia, descripcion) VALUES 
                ('70.j', 'Licencia Médica'),
                ('70.a', 'Vacaciones / Anual Ordinaria'),
                ('Art 6', 'Capacitación / Examen'),
                ('70.t', 'Atención Familiar')
            `);
        }

        console.log("Migración de licencias y códigos completada.");
    } catch (err) {
        console.error("Error en migración:", err.message);
    } finally {
        await connection.end();
    }
}

migrate();
