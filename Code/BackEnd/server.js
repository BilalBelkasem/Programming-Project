console.log('===> SERVER BESTAND IS GEACTIVEERD');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const upload = multer();
require('dotenv').config();

const db = require('./config/db');

// Routes importeren
const authMiddleware       = require('./middleware/authMiddleware');
const authRoutes           = require('./routes/authRoutes');
const companiesRoutes      = require('./companies');
const studentRoutes        = require('./students');
const badgeRoutes          = require('./badge');
const mijnProfielRoutes    = require('./Controller/mijnprofiel');
const studentDetailsRoutes = require('./Controller/studentDetails');
const reservationsRoutes   = require('./Controller/reservations');
const adminSpeeddateConfigRoutes = require('./Controller/adminSpeeddateConfig');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public', { index: 'public.html' }));

// DB beschikbaar maken per request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes mounten met auth middleware waar nodig
app.use('/api', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/mijnprofiel', authMiddleware.authenticateToken, mijnProfielRoutes);
app.use('/api/student_details', studentDetailsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/admin/speeddate-config', adminSpeeddateConfigRoutes);

// Extra routes


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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
