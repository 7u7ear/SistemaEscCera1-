require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/database');

async function runAndVerify() {
    try {
        console.log('Conectando a:', process.env.DB_HOST, ':', process.env.DB_PORT);
        console.log('Base de datos:', process.env.DB_NAME);

        // Verificar estado actual
        const [cols] = await db.query(`DESCRIBE alumnos`);
        const hasDeleted = cols.some(c => c.Field === 'deleted_at');
        console.log(`\nEstado actual - deleted_at existe: ${hasDeleted ? 'SÍ ✅' : 'NO ❌'}`);

        if (!hasDeleted) {
            console.log('\nAplicando ALTER TABLE...');
            await db.query(`ALTER TABLE alumnos ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL`);
            console.log('ALTER TABLE: OK ✅');
            
            console.log('\nCreando índice...');
            await db.query(`CREATE INDEX idx_alumnos_deleted_at ON alumnos (deleted_at)`);
            console.log('Índice: OK ✅');
        } else {
            console.log('La columna ya existe, no se necesita migrar.');
        }

        // Verificar resultado
        const [cols2] = await db.query(`DESCRIBE alumnos`);
        console.log('\n=== Schema final ===');
        cols2.forEach(c => console.log(`  ${c.Field}`));

        process.exit(0);
    } catch (err) {
        console.error('\n❌ Error:', err.message);
        console.error('Código:', err.code);
        process.exit(1);
    }
}

runAndVerify();
