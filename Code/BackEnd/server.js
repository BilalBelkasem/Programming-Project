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
app.use('/api/students', studentRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/mijnprofiel', authMiddleware.authenticateToken, mijnProfielRoutes);
app.use('/api/student_details', studentDetailsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/admin/speeddate-config', adminSpeeddateConfigRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
