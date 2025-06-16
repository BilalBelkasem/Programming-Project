const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});