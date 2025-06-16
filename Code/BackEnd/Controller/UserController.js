exports.getUsers = async (req, res) => {
  try {
    const [users] = await req.db.query('SELECT id, name FROM users WHERE role = "student"');
    res.json(users);
  } catch (err) {
    console.error('Users route error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentDetails = async (req, res) => {
  const sql = `
    SELECT users.id, users.name AS naam, students_details.school
    FROM users
    JOIN students_details ON students_details.user_id = users.id
  `;

  try {
    const [result] = await req.db.query(sql);
    res.json(result);
  } catch (err) {
    console.error('Fout bij ophalen studenten:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  console.log(`DELETE request ontvangen voor student id: ${studentId}`);

  const conn = await req.db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM students_details WHERE user_id = ?', [studentId]);
    await conn.query('DELETE FROM users WHERE id = ?', [studentId]);
    await conn.commit();
    res.json({ message: 'Student succesvol verwijderd' });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};