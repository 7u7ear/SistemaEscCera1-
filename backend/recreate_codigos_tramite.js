const mysql = require("mysql2/promise");
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "bd_ecn1"
};

async function createAndSeedCodigoTramites() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Conectado a bd_ecn1.");

        // Eliminar tabla anterior si existe
        await connection.query("DROP TABLE IF EXISTS `codigo_tramites`;");
        console.log("Tabla codigo_tramites anterior eliminada (si existía).");

        // También eliminar la otra si existe para evitar conflictos
        await connection.query("DROP TABLE IF EXISTS `codigos_tramite`;");
        console.log("Tabla codigos_tramite eliminada (si existía).");

        // Crear nueva tabla con la estructura proporcionada
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS \`codigo_tramites\` (
          \`id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
          \`codigo\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
          \`descripcion_tramite\` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
          \`activo\` tinyint(1) NOT NULL DEFAULT '1',
          \`created_at\` timestamp NULL DEFAULT NULL,
          \`updated_at\` timestamp NULL DEFAULT NULL,
          \`deleted_at\` timestamp NULL DEFAULT NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`codigo_tramites_codigo_unique\` (\`codigo\`),
          KEY \`codigo_tramites_codigo_index\` (\`codigo\`)
        ) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;

        await connection.query(createTableQuery);
        console.log("Tabla codigo_tramites creada con éxito.");

        // Insertar los datos
        const insertQuery = `
        INSERT INTO \`codigo_tramites\` (\`id\`, \`codigo\`, \`descripcion_tramite\`, \`activo\`, \`created_at\`, \`updated_at\`, \`deleted_at\`) VALUES
        (1, '212B', 'ALTA TITULAR', 1, NULL, NULL, NULL),
        (2, '212R', 'RENUNCIA TITULAR', 1, NULL, NULL, NULL),
        (3, '212S', 'ALTA SUPLENTE', 1, NULL, NULL, NULL),
        (4, '212F', 'FIN SUPLENCIA', 1, NULL, NULL, NULL);
        `;

        await connection.query(insertQuery);
        console.log("Datos insertados correctamente en codigo_tramites.");

        // Comprobar que se insertaron
        const [rows] = await connection.query("SELECT * FROM codigo_tramites");
        console.table(rows);

        await connection.end();
    } catch (error) {
        console.error("Error en la base de datos:", error.message);
    }
}

createAndSeedCodigoTramites();
