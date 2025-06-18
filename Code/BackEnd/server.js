// server.js
console.log('===> SERVER BESTAND IS GEACTIVEERD');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
<<<<<<< Updated upstream
const authRoutes = require('./routes/authRoutes'); // ✅ Alle routes hier gebundeld
=======

// Route imports
const authRoutes         = require('./routes/authRoutes');
const companiesRoutes    = require('./companies');
const studentRoutes      = require('./students');
const badgeRoutes        = require('./badge');
const mijnProfielRoutes  = require('./Controller/mijnprofiel');
const studentDetailsRoutes = require('./Controller/studentDetails'); // <-- nieuw
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public', { index: 'public.html' }));

<<<<<<< Updated upstream
<<<<<<< Updated upstream
// DB beschikbaar maken in elke request
=======
// Expose db per request
>>>>>>> Stashed changes
=======
// Expose db per request
>>>>>>> Stashed changes
app.use((req, res, next) => {
  req.db = db;
  next();
});

<<<<<<< Updated upstream
<<<<<<< Updated upstream
// ✅ Alle routes zitten hierin: login, registratie, profiel, studenten, bedrijven, favorieten, enz.
app.use('/api', authRoutes);

// Gezondheidstest (optioneel)
app.get('/api/health', (req, res) => {
  res.send('API is up and running');
});

// Server starten
=======
=======
>>>>>>> Stashed changes
// Mount routes
app.use('/api', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/mijnprofiel', mijnProfielRoutes);
app.use('/api/student_details', studentDetailsRoutes); // <-- nieuw

// Extra routes
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

app.delete('/api/studenten/:id', async (req, res) => {
  const studentId = req.params.id;
  console.log(`DELETE request ontvangen voor student id: ${studentId}`);

  const conn = await req.db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM students_details WHERE user_id = ?', [studentId]);
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

app.post('/api/register-company', upload.single('logo'), async (req, res) => {
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
});

>>>>>>> Stashed changes
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
