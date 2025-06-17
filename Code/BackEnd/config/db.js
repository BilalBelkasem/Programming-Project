// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  port:               process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0
});

// Optionnel : vérifier la connexion au démarrage
;(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL pool initialized');
  } catch (err) {
    console.error('❌ MySQL pool error', err);
    process.exit(1);
  }
})();

module.exports = pool;
