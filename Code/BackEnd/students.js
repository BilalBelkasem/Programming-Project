const express = require('express');
const router = express.Router();

// GET all students
router.get('/', async (req, res) => {
  try {
    const [students] = await req.db.query(`
      SELECT u.id, u.name, s.school, s.education, s.year, u.email
      FROM users u
      JOIN students_details s ON u.id = s.user_id
      WHERE u.role = 'student'
    `);

    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// NEW: GET student details by user id
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await req.db.query(`
      SELECT u.id, u.name AS full_name, u.email, s.school, s.richting, s.jaar, s.linkedin, s.about,
             s.profile_picture, s.looking_for, s.domains
      FROM users u
      JOIN students_details s ON u.id = s.user_id
      WHERE u.id = ?
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student niet gevonden' });
    }

    const student = rows[0];

    // Convert JSON strings to arrays if needed
    try {
      student.looking_for = JSON.parse(student.looking_for);
    } catch {
      student.looking_for = [];
    }

    try {
      student.domains = JSON.parse(student.domains);
    } catch {
      student.domains = [];
    }

    res.json(student);
  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).json({ error: 'Fout bij ophalen student details' });
  }
});

module.exports = router;
