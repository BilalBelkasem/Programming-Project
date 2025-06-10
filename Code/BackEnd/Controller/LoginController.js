const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);
  
  try {
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
      if (!password || !user.password_hash) {  
        console.error('Missing password in request or database');
        return res.status(400).json({ error: 'Password is missing in request or database' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);  

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.JWT_SECRET_KEY, 
        { expiresIn: '1h' }
      );
      
      res.json({
        token,
        user: { message: 'Login successful', token }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Protected route controller
const getProtectedData = (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
};

module.exports = {
  login,
  getProtectedData
};