import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import protectedRoutes from './routes/authRoutes.js';

// Laad de .env variabelen
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', protectedRoutes);

// Debug: toon welke waarden geladen zijn uit .env
console.log("Config geladen uit .env:", {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: process.env.DB_SOCKET
});

// MySQL connectie via socket (MAMP)
const db = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: process.env.DB_SOCKET // Geen host/port nodig bij socket
});

// Verbind met database
db.connect((err) => {
  if (err) {
    console.error('❌ Fout bij verbinden met database:', err.message);
    return;
  }
  console.log('✅ Verbonden met MySQL database via socket.');
});

// Start de server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server draait op poort ${PORT}`);
});