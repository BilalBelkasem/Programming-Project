// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // ✅ Alle routes hier gebundeld

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public', { index: 'public.html' }));

// DB beschikbaar maken in elke request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ✅ Alle routes zitten hierin: login, registratie, profiel, studenten, bedrijven, favorieten, enz.
app.use('/api', authRoutes);

// Gezondheidstest (optioneel)
app.get('/api/health', (req, res) => {
  res.send('API is up and running');
});

// Company registratie (met logo via multer)
app.post('/api/register-company', upload.single('logo'), async (req, res) => {
  try {
    const logoBuffer = req.file ? req.file.buffer : null;
    const {
      email, phone_number, password, company_name, website, sector,
      booth_contact_name, street, city, postal_code, booth_contact_email,
      invoice_contact_name, invoice_contact_email, vat_number
    } = req.body;

    const sql = `
      INSERT INTO companies_details (
        email, phone_number, password, company_name, website, sector,
        booth_contact_name, street, city, postal_code, booth_contact_email,
        invoice_contact_name, invoice_contact_email, vat_number, logo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await req.db.query(sql, [
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

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
