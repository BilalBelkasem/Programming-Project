// Controller/studentDetails.js
const express = require('express');
const router = express.Router();

// GET: haal studentgegevens op via user ID
router.get('/user/:id', async (req, res) => {
  const db = req.db;
  const { id } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        users.id,
        users.name AS full_name,
        users.email,
        students_details.school,
        students_details.education,
        students_details.year,
        students_details.about,
        students_details.linkedin_url,
        students_details.interest_jobstudent,
        students_details.interest_stage,
        students_details.interest_job,
        students_details.interest_connect,
        students_details.domain_data,
        students_details.domain_networking,
        students_details.domain_ai,
        students_details.domain_software
      FROM users
      JOIN students_details ON students_details.user_id = users.id
      WHERE users.id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student niet gevonden' });
    }

    const raw = rows[0];

    const looking_for = [];
    if (raw.interest_jobstudent) looking_for.push('jobstudent');
    if (raw.interest_stage) looking_for.push('stage');
    if (raw.interest_job) looking_for.push('job');
    if (raw.interest_connect) looking_for.push('connect');

    const domains = [];
    if (raw.domain_data) domains.push('data');
    if (raw.domain_networking) domains.push('networking');
    if (raw.domain_ai) domains.push('ai');
    if (raw.domain_software) domains.push('software');

    res.json({ ...raw, looking_for, domains });

  } catch (err) {
    console.error('Fout bij ophalen studentgegevens:', err);
    res.status(500).json({ error: 'Server fout' });
  }
});

module.exports = router;
