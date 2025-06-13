const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

// ✅ Corrigeerd pad (want je zit al in /BackEnd)
const protectedRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', protectedRoutes); // API routes

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

// Studenten ophalen
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

// Studenten verwijderen
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
