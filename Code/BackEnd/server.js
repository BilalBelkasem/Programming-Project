// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const mysql = require('mysql2');

// Import de ton pool promise-based
const db = require('./config/db');

// Route imports
const authRoutes         = require('./routes/authRoutes');
const companiesRoutes    = require('./companies');
const studentRoutes      = require('./students');
const badgeRoutes        = require('./badge');
const mijnProfielRoutes  = require('./Controller/ProfielStudent');
const bedrijfProfielRoutes = require('./Controller/BedrijfProfiel');
const mijnProfielRoutes  = require('./Controller/mijnprofiel');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public', { index: 'public.html' }));

// Middleware om de db pool beschikbaar te maken in req
app.use((req, res, next) => {
  req.db = pool.promise();
  next();
});

// Monte les routes
app.use('/api', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/mijnprofiel', mijnProfielRoutes);


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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend listening on port ${PORT}`);
});
