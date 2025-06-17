// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Import de ton pool promise-based
const db = require('./config/db');

// Database connection
const pool = require('./config/db'); // Make sure this exports the pool

// Middleware imports
const { authenticateToken } = require('./middleware/authMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const studentRoutes = require('./routes/studentRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes         = require('./routes/authRoutes');
const mijnProfielRoutes  = require('./Controller/mijnprofiel');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public', { index: 'public.html' }));

// Attach database to requests
app.use((req, res, next) => {
  req.db = pool; // No need for .promise() if db.js already exports promisified pool
  next();
});

// Optional: Log DB config (remove if not needed)
console.log('MySQL Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

// Routes
app.use('/api', authRoutes);
app.use('/api/companies', authenticateToken, companyRoutes); // Protected route example
app.use('/api/students', authenticateToken, studentRoutes);
app.use('/api/badges', authenticateToken, badgeRoutes);
app.use('/api/users', authenticateToken, userRoutes);
// Expose ton pool promise à chaque requête sous req.db
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Monte les routes
app.use('/api', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/mijnprofiel', mijnProfielRoutes);

// Example: récupérer tous les users étudiants
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await req.db.query(
      'SELECT id, name FROM users WHERE role = "student"'
    );
    res.json(users);
  } catch (err) {
    console.error('Users route error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Exemple : GET /api/studenten
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

// Exemple : DELETE /api/studenten/:id avec transaction
app.delete('/api/studenten/:id', async (req, res) => {
  const studentId = req.params.id;
  console.log(`DELETE request ontvangen voor student id: ${studentId}`);

  const conn = await req.db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'DELETE FROM students_details WHERE user_id = ?',
      [studentId]
    );
    await conn.query(
      'DELETE FROM users WHERE id = ?',
      [studentId]
    );
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

// Route pour enregistrer un company avec logo
app.post(
  '/api/register-company',
  upload.single('logo'),
  async (req, res) => {
    try {
      const logoBuffer = req.file ? req.file.buffer : null;
      const {
        email,
        phone_number,
        password,
        company_name,
        website,
        sector,
        booth_contact_name,
        street,
        city,
        postal_code,
        booth_contact_email,
        invoice_contact_name,
        invoice_contact_email,
        vat_number
      } = req.body;

      const sql = `
        INSERT INTO companies_details (
          email, phone_number, password, company_name, website, sector,
          booth_contact_name, street, city, postal_code, booth_contact_email,
          invoice_contact_name, invoice_contact_email, vat_number, logo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await req.db.query(sql, [
        email,
        phone_number,
        password,
        company_name,
        website,
        sector,
        booth_contact_name,
        street,
        city,
        postal_code,
        booth_contact_email,
        invoice_contact_name,
        invoice_contact_email,
        vat_number,
        logoBuffer
      ]);

      res.status(201).json({ message: 'Bedrijf succesvol geregistreerd' });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server fout' });
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});