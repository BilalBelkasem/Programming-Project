const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

const studentRoutes = require('./students');
const badgeRoutes = require('./badge');

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api', badgeRoutes);

app.get('/api/test-direct', (req, res) => {
  console.log('Direct /api/test-direct route hit');
  res.send('Direct route works!');
});

app.get('/', (req, res) => {
  console.log('Root route was hit');
  res.send('Server is up and running!');
});

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Start the server LAST
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
