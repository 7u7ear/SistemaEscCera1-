const db = require('../config/database');
(async () => {
    try {
        const [rows] = await db.query("SELECT username FROM usuarios");
        console.log(JSON.stringify(rows));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
