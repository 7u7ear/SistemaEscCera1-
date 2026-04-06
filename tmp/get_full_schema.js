const db = require('../config/database');
(async () => {
    try {
        const [tables] = await db.query("SHOW FULL TABLES WHERE Table_type = 'BASE TABLE'");
        const results = {};
        for (const t of tables) {
            const tableName = Object.values(t)[0];
            const [schema] = await db.query(`DESCRIBE ${tableName}`);
            results[tableName] = schema;
        }
        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
