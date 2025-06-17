const db = require('../config/db');

// ✅ Ophalen van alle studenten (mysql2/promise syntax)
exports.getAllStudents = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        users.id, 
        users.name AS naam, 
        COALESCE(students_details.school, users.organization) AS school
      FROM users
      LEFT JOIN students_details ON students_details.user_id = users.id
      WHERE users.role = 'student'
    `);
    res.json(result);
  } catch (err) {
    console.error('Fout bij ophalen studenten:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Verwijderen van een student met transaction (mysql2/promise)
exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  console.log(`DELETE request ontvangen voor student id: ${studentId}`);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('DELETE FROM favorites WHERE student_id = ?', [studentId]);
    await conn.query('DELETE FROM students_details WHERE user_id = ?', [studentId]);
    await conn.query('DELETE FROM users WHERE id = ?', [studentId]);

    await conn.commit();
    console.log(`User met id ${studentId} succesvol verwijderd.`);
    res.json({ message: 'Student succesvol verwijderd' });
  } catch (err) {
    await conn.rollback();
    console.error('Fout bij verwijderen student:', err);
    res.status(500).json({ error: 'Fout bij verwijderen student: ' + err.message });
  } finally {
    conn.release();
  }
};
