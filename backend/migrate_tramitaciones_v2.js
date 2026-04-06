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
        console.log("Creando tabla codigos_tramite...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS codigos_tramite (
                id INT AUTO_INCREMENT PRIMARY KEY,
                codigo VARCHAR(20) NOT NULL UNIQUE,
                descripcion VARCHAR(255) NOT NULL
            ) ENGINE=InnoDB;
        `);

        // Insertar algunos códigos de ejemplo
        await connection.query(`
            INSERT IGNORE INTO codigos_tramite (codigo, descripcion) VALUES 
            ('LIC-MED', 'Licencia Médica'),
            ('REN-CAR', 'Renuncia de Cargo'),
            ('ALT-DOC', 'Alta de Docente'),
            ('CERT-SER', 'Certificación de Servicios');
        `);

        console.log("Modificando tabla tramitaciones...");

        const addColumn = async (colName, colDef) => {
            try {
                await connection.query(`ALTER TABLE tramitaciones ADD COLUMN ${colName} ${colDef}`);
                console.log(`Columna ${colName} agregada.`);
            } catch (err) {
                if (err.code === 'ER_DUP_COLUMN_NAMES') {
                    console.log(`Columna ${colName} ya existe.`);
                } else {
                    throw err;
                }
            }
        };

        await addColumn('rol', 'INT NULL AFTER docente_id');
        await addColumn('expediente', 'VARCHAR(100) NULL AFTER rol');
        await addColumn('cargo_id', 'BIGINT UNSIGNED NULL AFTER expediente');
        await addColumn('codigo_tramite_id', 'INT NULL AFTER tipo_tramite');

        // Agregar llaves foráneas con try/catch similar
        try {
            await connection.query(`ALTER TABLE tramitaciones ADD CONSTRAINT fk_tramitaciones_cargo FOREIGN KEY (cargo_id) REFERENCES cargos(id)`);
        } catch (e) { }
        try {
            await connection.query(`ALTER TABLE tramitaciones ADD CONSTRAINT fk_tramitaciones_codigo FOREIGN KEY (codigo_tramite_id) REFERENCES codigos_tramite(id)`);
        } catch (e) { }

        await connection.query(`
            ALTER TABLE tramitaciones 
            MODIFY COLUMN estado ENUM('caratulado', 'en_tramitacion', 'espera_documentacion', 'urgente', 'realizado') DEFAULT 'caratulado';
        `);

        console.log("Migración completada exitosamente.");
    } catch (err) {
        console.error("Error en migración:", err.message);
    } finally {
        await connection.end();
    }
}

migrate();
