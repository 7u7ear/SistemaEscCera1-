const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",   // si tenés password en WAMP ponelo acá
    database: "bd_ecn1"
});

module.exports = db;