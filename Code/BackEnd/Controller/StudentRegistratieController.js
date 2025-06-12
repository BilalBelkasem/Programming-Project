const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// User registration
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const name = `${firstName} ${lastName}`;
    const profile_slug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
    const organization = role === 'student' ? 'Hogeschool Gent' : null;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = 'INSERT INTO users (name, email, password_hash, role, organization, profile_slug) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(query, [name, email, hashedPassword, role, organization, profile_slug], (err, results) => {
        if (err) {
          console.error('Failed to register user:', err);
          return res.status(500).json({ error: 'Failed to register user: ' + err.message });
        }

        const userId = results.insertId;

        if (role === 'student') {
          // Let op: tabelnaam hier aangepast naar 'students_details'
          const studentDetailsQuery = 'INSERT INTO students_details (user_id) VALUES (?)';
          db.query(studentDetailsQuery, [userId], (err) => {
            if (err) {
              console.error('Failed to insert student details:', err);
              return res.status(500).json({ error: 'Failed to create student details: ' + err.message });
            }

            const token = jwt.sign({ id: userId, email, role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            res.status(201).json({ 
              message: 'User registered successfully',
              token,
              user: { id: userId, name, email, role, organization, profile_slug }
            });
          });
        } else {
          const token = jwt.sign({ id: userId, email, role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
          res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: { id: userId, name, email, role, organization, profile_slug }
          });
        }
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// Protected data handler
exports.getProtectedData = (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
};
