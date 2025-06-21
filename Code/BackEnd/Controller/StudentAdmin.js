const db = require('../config/db');

exports.getAllStudents = async (req, res) => {
  const sql = `
    SELECT 
      users.id, 
      users.name AS naam, 
      COALESCE(students_details.school, users.organization) AS school
    FROM users
    LEFT JOIN students_details ON students_details.user_id = users.id
    WHERE users.role = 'student'
  `;

  try {
    const [result] = await db.query(sql);
    res.json(result);
  } catch (err) {
    console.error('Fout bij ophalen studenten:', err);
    return res.status(500).json({ error: 'Fout bij het ophalen van studenten' });
  }
};

exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  console.log(`DELETE request ontvangen voor student id: ${studentId}`);
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Step 1: Delete from favorites
    await connection.query('DELETE FROM favorites WHERE student_id = ?', [studentId]);

    // Step 2: Delete from students_details
    await connection.query('DELETE FROM students_details WHERE user_id = ?', [studentId]);

    // Step 3: Delete from users
    await connection.query('DELETE FROM users WHERE id = ?', [studentId]);

    await connection.commit();
    
    console.log(`User met id ${studentId} succesvol verwijderd.`);
    res.json({ message: 'Student succesvol verwijderd' });

  } catch (err) {
    console.error(`Fout bij verwijderen student ${studentId}:`, err);
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({ error: 'Fout bij verwijderen van de student' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
