const { Pool, types } = require('pg');
require('dotenv').config();

// Return DATE columns as plain "YYYY-MM-DD" strings (not JS Date objects)
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;
