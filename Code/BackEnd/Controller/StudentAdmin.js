const db = require('../config/db');

exports.getAllStudents = (req, res) => {
  const sql = `
    SELECT 
      users.id, 
      users.name AS naam, 
      COALESCE(students_details.school, users.organization) AS school
    FROM users
    LEFT JOIN students_details ON students_details.user_id = users.id
    WHERE users.role = 'student'
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Fout bij ophalen studenten:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
};

exports.deleteStudent = (req, res) => {
  const studentId = req.params.id;
  console.log(`DELETE request ontvangen voor student id: ${studentId}`);

  db.beginTransaction(err => {
    if (err) {
      console.error('Fout bij starten transaction:', err);
      return res.status(500).json({ error: 'Fout bij starten database transaction' });
    }

    // ✅ Step 1: Delete from favorites first to respect foreign key constraint
    db.query('DELETE FROM favorites WHERE student_id = ?', [studentId], (err) => {
      if (err) {
        console.error('Fout bij verwijderen uit favorites:', err);
        return db.rollback(() => {
          res.status(500).json({ error: 'Fout bij verwijderen uit favorites: ' + err.message });
        });
      }

      // ✅ Step 2: Then delete from students_details
      const deleteDetailsSql = 'DELETE FROM students_details WHERE user_id = ?';
      db.query(deleteDetailsSql, [studentId], (err) => {
        if (err) {
          console.error('Fout bij verwijderen student details:', err);
          return db.rollback(() => {
            res.status(500).json({ error: 'Fout bij verwijderen student details: ' + err.message });
          });
        }

        // ✅ Step 3: Then delete from users
        const deleteUserSql = 'DELETE FROM users WHERE id = ?';
        db.query(deleteUserSql, [studentId], (err2) => {
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
};
