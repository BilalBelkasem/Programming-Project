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
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  console.log(`DELETE request ontvangen voor student id: ${studentId}`);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    
    await connection.query('DELETE FROM favorites WHERE student_id = ?', [studentId]);

  
    await connection.query('DELETE FROM students_details WHERE user_id = ?', [studentId]);

   
    await connection.query('DELETE FROM users WHERE id = ?', [studentId]);

    await connection.commit();

    console.log(`User met id ${studentId} succesvol verwijderd.`);
    res.json({ message: 'Student succesvol verwijderd' });
  } catch (err) {
    await connection.rollback();
    console.error('Fout bij verwijderen student:', err);
    res.status(500).json({ error: 'Fout bij verwijderen student: ' + err.message });
  } finally {
    connection.release();
  }
};
