const express = require('express');
const router = express.Router();

// GET all students
router.get('/', async (req, res) => {
  try {
    const [students] = await req.db.query(`
      SELECT u.id, u.name, u.email, s.school, s.education, s.year 
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

module.exports = router;