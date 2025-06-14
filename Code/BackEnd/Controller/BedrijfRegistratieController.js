const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const multer = require('multer');
const path = require('path');

// Multer configuratie
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/logos/'); // map waar logo's worden opgeslagen
  },
  filename: function (req, file, cb) {
    // Unieke naam, bijvoorbeeld tijd + originele extensie
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Alleen afbeeldingen zijn toegestaan!'));
  }
};

const upload = multer({ storage, fileFilter }).single('logo'); // 'logo' is de fieldname

exports.registerCompany = async (req, res) => {
   upload(req, res, async function (err) {
    if (err) {
      // Fout bij upload
      return res.status(400).json({ error: err.message });
    }

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

    const logoFilename = req.file ? req.file.filename : null;
      if (req.file && !req.file.filename) {
        return res.status(400).json({ error: 'Probleem met het uploaden van het logo' });
      }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error: ' + err.message });

      if (results.length > 0) {
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

      db.query(userSql, [name, email, hashedPassword, role, profile_slug], (err, result) => {
        if (err) return res.status(500).json({ error: 'User insert error: ' + err.message });

        const userId = result.insertId;

        const companySql = `
          INSERT INTO companies_details (
            user_id, company_name, sector, website, phone_number,
            street, postal_code, city,
            booth_contact_name, booth_contact_email,
            invoice_contact_name, invoice_contact_email,
            po_number, vat_number , logo
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          userId, company_name, sector, website, phone_number,
          street, postal_code, city,
          booth_contact_name, booth_contact_email,
          invoice_contact_name, invoice_contact_email,
          po_number, vat_number, logoFilename
        ];

        db.query(companySql, values, (err2) => {
          if (err2) return res.status(500).json({ error: 'Company insert error: ' + err2.message });

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
        });
      });
    });

    } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
  }); // sluit upload()
}; // sluit exports.registerCompany
