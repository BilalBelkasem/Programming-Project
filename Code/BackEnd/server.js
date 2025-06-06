    const express = require('express');
    const mysql = require('mysql2');
    const cors = require('cors');
    require('dotenv').config();

    const app = express();
    const studentRoutes = require('./students');
    const badgeRoutes = require('./badge');
    app.use('/api/students', studentRoutes);
    app.use(cors());
    app.use(express.json());
    app.use('/api', badgeRoutes);

    // Create MySQL connection
    const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    });

    // Connect to MySQL
    db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
    });

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });
