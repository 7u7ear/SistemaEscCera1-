require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/database');

async function checkSchema() {
    try {
        const [cols] = await db.query(`DESCRIBE alumnos`);
        console.log('=== Columnas de tabla alumnos ===');
        cols.forEach(c => console.log(`  ${c.Field} (${c.Type}) ${c.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${c.Default !== null ? 'DEFAULT ' + c.Default : ''}`));
        
        const hasDeletedAt = cols.some(c => c.Field === 'deleted_at');
        console.log(`\n¿Tiene deleted_at? ${hasDeletedAt ? 'SÍ ✅' : 'NO ❌'}`);
        
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkSchema();
