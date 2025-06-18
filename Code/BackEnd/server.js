// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
