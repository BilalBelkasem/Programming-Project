const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const protectedRoutes = require('./routes/authRoutes'); // jouw bestaande routes

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', protectedRoutes); // je andere API routes

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Route om studenten met school op te halen uit join van users en students_details
app.get('/api/studenten', (req, res) => {
  const sql = `
    SELECT users.id, users.name AS naam, students_details.school
    FROM users
    JOIN students_details ON students_details.user_id = users.id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Fout bij ophalen studenten:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// DELETE endpoint met transaction voor veilig verwijderen van user + details
app.delete('/api/studenten/:id', (req, res) => {
  const studentId = req.params.id;
  console.log(`DELETE request ontvangen voor student id: ${studentId}`);

  db.beginTransaction(err => {
    if (err) {
      console.error('Fout bij starten transaction:', err);
      return res.status(500).json({ error: 'Fout bij starten database transaction' });
    }

    const deleteDetailsSql = 'DELETE FROM students_details WHERE user_id = ?';
    db.query(deleteDetailsSql, [studentId], (err) => {
      if (err) {
        console.error('Fout bij verwijderen student details:', err);
        return db.rollback(() => {
          res.status(500).json({ error: 'Fout bij verwijderen student details: ' + err.message });
        });
      }
      console.log(`Student details verwijderd voor user_id: ${studentId}`);

      const deleteUserSql = 'DELETE FROM users WHERE id = ?';
      db.query(deleteUserSql, [studentId], (err2, result) => {
        if (err2) {
          console.error('Fout bij verwijderen student:', err2);
          return db.rollback(() => {
            res.status(500).json({ error: 'Fout bij verwijderen student: ' + err2.message });
          });
        }

        db.commit(commitErr => {
          if (commitErr) {
            console.error('Fout bij commit van transaction:', commitErr);
            return db.rollback(() => {
              res.status(500).json({ error: 'Fout bij commit van transaction' });
            });
          }

          console.log(`User met id ${studentId} succesvol verwijderd.`);
          res.json({ message: 'Student succesvol verwijderd' });
        });
      });
    });
  });
});

// *** NIEUWE ROUTE VOOR COMPANY REGISTRATIE MET LOGO ***
app.post('/api/register-company', upload.single('logo'), async (req, res) => {
  try {
    const logoBuffer = req.file ? req.file.buffer : null;

    const {
      email,
      phone_number,
      password,
      company_name,
      website,
      sector,
      booth_contact_name,
      street,
      city,
      postal_code,
      booth_contact_email,
      invoice_contact_name,
      invoice_contact_email,
      vat_number
    } = req.body;

    const sql = `
      INSERT INTO companies_details (
        email, phone_number, password, company_name, website, sector,
        booth_contact_name, street, city, postal_code, booth_contact_email,
        invoice_contact_name, invoice_contact_email, vat_number, logo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        email,
        phone_number,
        password,
        company_name,
        website,
        sector,
        booth_contact_name,
        street,
        city,
        postal_code,
        booth_contact_email,
        invoice_contact_name,
        invoice_contact_email,
        vat_number,
        logoBuffer
      ],
      (err, result) => {
        if (err) {
          console.error('Fout bij registratie:', err);
          return res.status(500).json({ error: 'Registratie mislukt' });
        }
        res.status(201).json({ message: 'Bedrijf succesvol geregistreerd' });
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server fout' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
