const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();


// Route imports
const protectedRoutes = require('./routes/authRoutes');
const companiesRoutes = require('./companies');
const studentRoutes = require('./students');
const badgeRoutes = require('./badge');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public', {
  index: 'public.html'
}));

app.use('/api', protectedRoutes); // API routes

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Connecting to MySQL with:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD);
console.log('Database:', process.env.DB_NAME);

// Zet pool op elke request
app.use((req, res, next) => {
  req.db = pool.promise(); // gebruik async/await compatible pool
  next();
});

// Mount routes
app.use('/api', protectedRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/badges', badgeRoutes);

// Users ophalen
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await req.db.query('SELECT id, name FROM users WHERE role = "student"');
    res.json(users);
  } catch (err) {
    console.error('Users route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Studentgegevens ophalen (users + school via JOIN)
app.get('/api/studenten', async (req, res) => {
  const sql = `
    SELECT users.id, users.name AS naam, students_details.school
    FROM users
    JOIN students_details ON students_details.user_id = users.id
  `;

  try {
    const [result] = await req.db.query(sql);
    res.json(result);
  } catch (err) {
    console.error('Fout bij ophalen studenten:', err);
    res.status(500).json({ error: err.message });
  }
});

// Student verwijderen met transaction
app.delete('/api/studenten/:id', async (req, res) => {
  const studentId = req.params.id;
  console.log(`DELETE request ontvangen voor student id: ${studentId}`);

  const conn = await pool.promise().getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('DELETE FROM students_details WHERE user_id = ?', [studentId]);
    console.log(`Student details verwijderd voor user_id: ${studentId}`);

    await conn.query('DELETE FROM users WHERE id = ?', [studentId]);

    await conn.commit();
    console.log(`User met id ${studentId} succesvol verwijderd.`);
    res.json({ message: 'Student succesvol verwijderd' });
  } catch (err) {
    await conn.rollback();
    console.error('Fout bij verwijderen student:', err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
