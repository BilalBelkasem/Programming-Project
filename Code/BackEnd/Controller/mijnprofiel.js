const db = require('../config/db');

exports.getStudentProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await req.db.query(`
      SELECT u.name, u.email,
             s.school, s.education, s.year, s.about, s.linkedin_url,
             s.interest_jobstudent, s.interest_stage, s.interest_job, s.interest_connect,
             s.domain_data, s.domain_networking, s.domain_ai, s.domain_software
      FROM users u
      LEFT JOIN students_details s ON s.user_id = u.id
      WHERE u.id = ? AND u.role = 'student'
    `, [userId]);

    if (rows.length === 0) return res.status(404).json({ error: 'Profiel niet gevonden' });

    const row = rows[0];

    res.json({
      ...row,
      interest_jobstudent: row.interest_jobstudent === 1,
      interest_stage: row.interest_stage === 1,
      interest_job: row.interest_job === 1,
      interest_connect: row.interest_connect === 1,
      domain_data: row.domain_data === 1,
      domain_networking: row.domain_networking === 1,
      domain_ai: row.domain_ai === 1,
      domain_software: row.domain_software === 1
    });
  } catch (err) {
    console.error('Fout bij ophalen profiel:', err);
    res.status(500).json({ error: 'Serverfout' });
  }
};

exports.updateStudentProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    name, email, school, education, year, about, linkedin_url,
    lookingFor = [], domains = []
  } = req.body;

  try {
    await req.db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [
      name, email, userId
    ]);

    // Check if students_details exists
    const [rows] = await req.db.query(
      'SELECT * FROM students_details WHERE user_id = ?',
      [userId]
    );

    const interest_jobstudent = lookingFor.includes("Jobstudent") ? 1 : 0;
    const interest_stage = lookingFor.includes("Stage") ? 1 : 0;
    const interest_job = lookingFor.includes("Job") ? 1 : 0;
    const interest_connect = lookingFor.includes("Connecties") ? 1 : 0;

    const domain_data = domains.includes("Data") ? 1 : 0;
    const domain_networking = domains.includes("Netwerking") ? 1 : 0;
    const domain_ai = domains.includes("AI / Robotica") ? 1 : 0;
    const domain_software = domains.includes("Software") ? 1 : 0;

    if (rows.length > 0) {
      await req.db.query(`
        UPDATE students_details SET
          school = ?, education = ?, year = ?, about = ?, linkedin_url = ?,
          interest_jobstudent = ?, interest_stage = ?, interest_job = ?, interest_connect = ?,
          domain_data = ?, domain_networking = ?, domain_ai = ?, domain_software = ?
        WHERE user_id = ?
      `, [
        school, education, year, about, linkedin_url,
        interest_jobstudent, interest_stage, interest_job, interest_connect,
        domain_data, domain_networking, domain_ai, domain_software,
        userId
      ]);
    } else {
      await req.db.query(`
        INSERT INTO students_details
          (user_id, school, education, year, about, linkedin_url,
           interest_jobstudent, interest_stage, interest_job, interest_connect,
           domain_data, domain_networking, domain_ai, domain_software)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, school, education, year, about, linkedin_url,
        interest_jobstudent, interest_stage, interest_job, interest_connect,
        domain_data, domain_networking, domain_ai, domain_software
      ]);
    }

    res.json({ message: 'Profiel bijgewerkt' });
  } catch (err) {
    console.error('Fout bij opslaan profiel:', err);
    res.status(500).json({ error: 'Serverfout' });
  }
};