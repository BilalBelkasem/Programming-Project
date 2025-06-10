const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email); // Add this line
  
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    
    // Add defensive check for password
    if (!password || !user.password_hash) {  // Change user.password to user.password_hash
      console.error('Missing password in request or database');
      return res.status(400).json({ error: 'Password is missing in request or database' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);  // Change user.password to user.password_hash

    if (!isMatch){
      return res.status(401).json({ error: 'invalide email or password'});
    }

    const token = jwt.sign({ id: user.id, email: user.email}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
    res.json({ token, user: { message: 'Login successful', token}});


    });
});

// Protected route
router.get('/protected', authenticateToken, (req, res) => {  
    res.json({message: 'This is a protected route', user: req.user});
});

module.exports = router;
