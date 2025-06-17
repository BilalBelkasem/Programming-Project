const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ storage, fileFilter }).single('logo');

exports.registerCompany = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const {
        email,
        password,
        organization,
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

      if (!email || !password || !organization || !booth_contact_name) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const logoBuffer = req.file ? req.file.buffer : null;

      const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'A user with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const role = 'bedrijf';
      const name = booth_contact_name;
      const profile_slug = booth_contact_name.toLowerCase().replace(/\s+/g, '-');

      const userSql = `
        INSERT INTO users (name, email, password_hash, role, profile_slug)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [userResult] = await db.query(userSql, [name, email, hashedPassword, role, profile_slug]);
      const userId = userResult.insertId;

      const companySql = `
        INSERT INTO companies_details (
          user_id, company_name, sector, website, phone_number,
          street, postal_code, city,
          booth_contact_name, booth_contact_email,
          invoice_contact_name, invoice_contact_email,
          po_number, vat_number, logo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        userId, company_name, sector, website, phone_number,
        street, postal_code, city,
        booth_contact_name, booth_contact_email,
        invoice_contact_name, invoice_contact_email,
        po_number, vat_number, logoBuffer
      ];

      await db.query(companySql, values);

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
          name,
          email,
          role,
          profile_slug
        }
      });

    } catch (error) {
      console.error('Company registration error:', error);
      res.status(500).json({ error: 'Server error: ' + error.message });
    }
  });
};
