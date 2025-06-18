const db = require('../config/db');

exports.getCompanyProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await req.db.query(`
      SELECT u.name, u.email, c.company_name, c.about,
             c.website, c.zoek_jobstudent, c.zoek_connecties, c.zoek_stage, c.zoek_job,
             c.domein_data, c.domein_netwerking, c.domein_ai, c.domein_software
      FROM users u
      JOIN companies_details c ON c.user_id = u.id
      WHERE u.id = ? AND u.role = 'bedrijf'
    `, [userId]);

    if (rows.length === 0) return res.status(404).json({ error: 'Profiel niet gevonden' });

    const row = rows[0];

    // ✅ Converteer integers naar booleans
    res.json({
      ...row,
      zoek_jobstudent: row.zoek_jobstudent === 1,
      zoek_connecties: row.zoek_connecties === 1,
      zoek_stage: row.zoek_stage === 1,
      zoek_job: row.zoek_job === 1,
      domein_data: row.domein_data === 1,
      domein_netwerking: row.domein_netwerking === 1,
      domein_ai: row.domein_ai === 1,
      domein_software: row.domein_software === 1
    });
  } catch (err) {
    console.error('Fout bij ophalen profiel:', err);
    res.status(500).json({ error: 'Serverfout' });
  }
};


exports.updateCompanyProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    name, email, company_name, linkedin, about,
    lookingFor = [], domains = []
  } = req.body;

  try {
    await req.db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [
      name, email, userId
    ]);

    await req.db.query(`
      UPDATE companies_details SET
        company_name = ?, website = ?, about = ?,
        zoek_jobstudent = ?, zoek_connecties = ?, zoek_stage = ?, zoek_job = ?,
        domein_data = ?, domein_netwerking = ?, domein_ai = ?, domein_software = ?
      WHERE user_id = ?
    `, [
      company_name,
      linkedin,
      about,
      lookingFor.includes("Jobstudent") ? 1 : 0,
      lookingFor.includes("Connecties") ? 1 : 0,
      lookingFor.includes("Stage") ? 1 : 0,
      lookingFor.includes("Voltijds personeel") ? 1 : 0,
      domains.includes("Data") ? 1 : 0,
      domains.includes("Netwerking") ? 1 : 0,
      domains.includes("AI / Robotica") ? 1 : 0,
      domains.includes("Software") ? 1 : 0,
      userId
    ]);

    res.json({ message: 'Profiel bijgewerkt' });
  } catch (err) {
    console.error('Fout bij opslaan profiel:', err);
    res.status(500).json({ error: 'Serverfout' });
  }
};
