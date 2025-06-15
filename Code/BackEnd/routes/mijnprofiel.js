// routes/mijnprofiel.js
const express = require('express');
const router = express.Router();

// GET student profile
router.get('/:id', async (req, res) => {
  const studentId = req.params.id;
  const db = req.db;

  const sql = `
    SELECT users.id, users.name, users.lastname, users.email,
           sd.school, sd.education, sd.year, sd.about, sd.linkedin_url,
           sd.interest_jobstudent, sd.interest_stage, sd.interest_job, sd.interest_connect,
           sd.domain_data, sd.domain_networking, sd.domain_ai, sd.domain_software
    FROM users
    LEFT JOIN students_details AS sd ON users.id = sd.user_id
    WHERE users.id = ?
  `;

  try {
    const [results] = await db.query(sql, [studentId]);
    if (results.length === 0) return res.status(404).json({ error: 'Student not found' });

    const student = results[0];

    student.lookingFor = [
      student.interest_jobstudent && 'Jobstudent',
      student.interest_stage && 'Stage',
      student.interest_job && 'Job',
      student.interest_connect && 'Connecties'
    ].filter(Boolean);

    student.domain = [
      student.domain_data && 'Data',
      student.domain_networking && 'Netwerking',
      student.domain_ai && 'AI / Robotica',
      student.domain_software && 'Software'
    ].filter(Boolean);

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching student data' });
  }
});

// PUT student profile
router.put('/:id', async (req, res) => {
  const studentId = req.params.id;
  const db = req.db;

  const {
    name, lastname, email,
    school, direction, year, about, linkedin,
    lookingFor = [], domain = []
  } = req.body;

  const interest_jobstudent = lookingFor.includes('Jobstudent');
  const interest_stage = lookingFor.includes('Stage');
  const interest_job = lookingFor.includes('Job');
  const interest_connect = lookingFor.includes('Connecties');

  const domain_data = domain.includes('Data');
  const domain_networking = domain.includes('Netwerking');
  const domain_ai = domain.includes('AI / Robotica');
  const domain_software = domain.includes('Software');

  try {
    await db.query(
      `UPDATE users SET name = ?, lastname = ?, email = ? WHERE id = ?`,
      [name, lastname, email, studentId]
    );

    await db.query(
      `UPDATE students_details 
       SET school = ?, education = ?, year = ?, about = ?, linkedin_url = ?,
           interest_jobstudent = ?, interest_stage = ?, interest_job = ?, interest_connect = ?,
           domain_data = ?, domain_networking = ?, domain_ai = ?, domain_software = ?
       WHERE user_id = ?`,
      [
        school, direction, year, about, linkedin,
        interest_jobstudent, interest_stage, interest_job, interest_connect,
        domain_data, domain_networking, domain_ai, domain_software,
        studentId
      ]
    );

    res.json({ message: 'Student updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});




module.exports = router;
