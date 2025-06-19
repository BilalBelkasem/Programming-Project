console.log('===> SERVER BESTAND IS GEACTIVEERD');
const express = require('express');
const cors = require('cors');
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
const bedrijfLikeStudentRoutes = require('./Controller/BedrijfLikeStudentController');

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

// Mount all main routers (do NOT define individual routes here)
app.use('/api', authRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/mijnprofiel', authMiddleware.authenticateToken, mijnProfielRoutes);
app.use('/api/student_details', studentDetailsRoutes);
app.use('/api/bedrijf-like-student', bedrijfLikeStudentRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
