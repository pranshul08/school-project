// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1', // use 127.0.0.1 instead of 'localhost' to avoid IPv6 issues
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306, // <=== add this line
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected!');
});

module.exports = db;
