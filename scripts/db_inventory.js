const pool = require('../config/database');

async function checkDatabase() {
    try {
        const [tables] = await pool.query('SHOW FULL TABLES');
        const dbName = process.env.DB_NAME || 'bd_ecn1';
        const tableKey = `Tables_in_${dbName}`;
        const typeKey = 'Table_type';

        const results = [];
        for (const tableObj of tables) {
            const tableName = tableObj[tableKey];
            const tableType = tableObj[typeKey];
            let count = -1;
            let error = null;

            try {
                const [[{ count: rowCount }]] = await pool.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
                count = rowCount;
            } catch (err) {
                error = err.message;
            }

            results.push({ tableName, tableType, count, error });
        }

        console.log(JSON.stringify(results, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkDatabase();
