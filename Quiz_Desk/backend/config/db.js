const mysql = require('mysql2');
const path = require('path');

// Load backend/.env file
require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

// Create Local MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'quizdesk_db',
    port: Number(process.env.DB_PORT) || 3306
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('MySQL Database Connected Successfully!');
    }
});

// Export connection
module.exports = db;