const pool = require('../config/database');
const { execSync } = require('child_process');
const path = require('path');

async function analyzeDatabase() {
    try {
        const [tables] = await pool.query('SHOW FULL TABLES');
        const dbName = process.env.DB_NAME || 'bd_ecn1';
        const tableKey = `Tables_in_${dbName}`;
        const typeKey = 'Table_type';

        const results = [];
        const srcPath = path.resolve(__dirname, '../src');

        for (const tableObj of tables) {
            const tableName = tableObj[tableKey];
            const tableType = tableObj[typeKey];
            let rowCount = -1;
            let dbError = null;

            // Get row count
            try {
                const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
                rowCount = count;
            } catch (err) {
                dbError = err.message;
            }

            // Search in code
            let occurrences = 0;
            const searchPaths = [
                path.resolve(__dirname, '../src'),
                path.resolve(__dirname, '../backend'),
                path.resolve(__dirname, '../frontend'),
                path.resolve(__dirname, '../shared')
            ];

            for (const sPath of searchPaths) {
                    try {
                        const rgCmd = `rg -iwc "${tableName}" "${sPath}"`;
                        const output = execSync(rgCmd, { encoding: 'utf8' }).trim();
                        // rg -c returns multiple lines "file:count", we sum them up
                        const counts = output.split('\n').map(line => {
                            const match = line.match(/:(\d+)$/);
                            return match ? parseInt(match[1]) : 0;
                        });
                        occurrences += counts.reduce((a, b) => a + b, 0);
                    } catch (err) {
                        // rg exits with 1 if no matches, catch and ignore
                    }

            }

            results.push({ tableName, tableType, rowCount, occurrences, dbError });


        }

        console.log("| Table Name | Type | Rows | Code Refs | Status/Error |");
        console.log("|------------|------|------|-----------|--------------|");
        results.forEach(r => {
            let status = "";
            if (r.dbError) {
                status = `⚠️ DB Error: ${r.dbError.substring(0, 30)}...`;
            } else if (r.rowCount === 0 && r.occurrences === 0) {
                status = "❌ **Potential Deletion Candidate**";
            } else if (r.occurrences === 0) {
                status = "⚠️ No code references";
            } else if (r.rowCount === 0) {
                status = "ℹ️ Referenced but empty";
            } else {
                status = "✅ Active";
            }
            console.log(`| ${r.tableName} | ${r.tableType} | ${r.rowCount === -1 ? '?' : r.rowCount} | ${r.occurrences} | ${status} |`);
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

analyzeDatabase();
