const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const BedrijvenController = require('./BedrijvenController');

exports.registerCompany = async (req, res) => {
  try {
    const {
      email,
      password,
      company_name,
      website,
      phone_number,
      street,
      postal_code,
      city,
      booth_contact_name,
      booth_contact_email,
      invoice_contact_name,
      invoice_contact_email,
      po_number,
      vat_number,
      sector
    } = req.body;

    if (!email || !password || !company_name || !booth_contact_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = 'bedrijf';
    const name = booth_contact_name;
    const profile_slug = booth_contact_name.toLowerCase().replace(/\s+/g, '-');

    // Insert user
    const [userResult] = await db.query(
      `INSERT INTO users (name, email, password_hash, role, profile_slug)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, profile_slug]
    );
    const userId = userResult.insertId;

    // Insert company details
    const [companyResult] = await db.query(
      `INSERT INTO companies_details (
        user_id, company_name, sector, website, phone_number,
        street, postal_code, city,
        booth_contact_name, booth_contact_email,
        invoice_contact_name, invoice_contact_email,
        po_number, vat_number
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, company_name, sector, website, phone_number,
        street, postal_code, city,
        booth_contact_name, booth_contact_email,
        invoice_contact_name, invoice_contact_email,
        po_number, vat_number
      ]
    );
    const companyId = companyResult.insertId;

    // Invalidate cache since we added a new company
    BedrijvenController.invalidateCache();

    const token = jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Company registered successfully!',
      token,
      user: {
        id: userId,
        company_id: companyId,
        name,
        email,
        role,
        profile_slug
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
