const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Define login function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Log for debugging
    console.log(`Attempting login for: ${email}`);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      console.log(`Found ${results.length} users with this email`);
      
      if (results.length === 0) {
        // Important: Return 401 for invalid credentials
        console.log('No user found with this email');
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      const user = results[0];
      
      // Compare passwords using bcrypt
      const isMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!isMatch) {
        console.log('Password does not match');
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

// Export both functions
module.exports = {
  login,
  getProtectedData
};