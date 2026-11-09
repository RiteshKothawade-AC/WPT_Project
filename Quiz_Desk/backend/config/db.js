
const mysql = require('mysql2');
require('dotenv').config({
    path: require('path').resolve(__dirname, '../.env')
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),

    // TiDB Cloud Starter requires TLS
    ssl: {
        minVersion: 'TLSv1.2'
    }
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('TiDB Cloud Connected Successfully!');
    }
});

module.exports = db;
