
// const mysql = require('mysql2');
// require('dotenv').config({
//     path: require('path').resolve(__dirname, '../.env')
// });

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: Number(process.env.DB_PORT),

//     // TiDB Cloud Starter requires TLS
//     ssl: {
//         minVersion: 'TLSv1.2'
//     }
// });

// db.connect((err) => {
//     if (err) {
//         console.error('Database connection failed:', err.message);
//     } else {
//         console.log('TiDB Cloud Connected Successfully!');
//     }
// });

// module.exports = db;

const mysql = require('mysql2');
<<<<<<< HEAD
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    ssl: {
        minVersion: 'TLSv1.2'
    }
=======

require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
>>>>>>> ec408d7da9908ee6fcf45c0cfec29763afa41ce2
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log('Database connection failed:', err.message);
  } else {
    console.log('MySQL Database Connected Successfully!');
  }
});

module.exports = db;
