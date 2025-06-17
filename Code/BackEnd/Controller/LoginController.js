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

    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO users (name, email, password_hash, role, organization, profile_slug) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [name, email, hashedPassword, role, organization, profile_slug]);
    const userId = result.insertId;

    if (role === 'student') {
      const studentDetailsQuery = 'INSERT INTO students_details (user_id) VALUES (?)';
      await db.query(studentDetailsQuery, [userId]);
    }

    const token = jwt.sign({ id: userId, email, role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { id: userId, name, email, role, organization, profile_slug }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// User login
exports.login = async (req, res) => {
  console.log('Login request ontvangen');
  
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || null,
        role: user.role,
        organization: user.organization,
        profile_slug: user.profile_slug
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// Protected data handler
exports.getProtectedData = (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
};
