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
    res.json(rows[0]);
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

