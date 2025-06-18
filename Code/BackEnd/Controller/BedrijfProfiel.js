const express = require('express');
const router = express.Router();

// GET bedrijfsprofiel op basis van user_id
router.get('/company-details/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await req.db.query(
      'SELECT * FROM companies_details WHERE user_id = ?',
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    const bedrijf = rows[0];

    bedrijf.lookingFor = [
      bedrijf.interest_jobstudent && 'Jobstudent',
      bedrijf.interest_stage && 'Stage',
      bedrijf.interest_job && 'Voltijds personeel',
      bedrijf.interest_connect && 'Connecties'
    ].filter(Boolean);

    bedrijf.domains = [
      bedrijf.domain_data && 'Data',
      bedrijf.domain_networking && 'Netwerking',
      bedrijf.domain_ai && 'AI / Robotica',
      bedrijf.domain_software && 'Software'
    ].filter(Boolean);

    res.json(bedrijf);
  } catch (err) {
    console.error('Fout bij ophalen bedrijfsprofiel:', err);
    res.status(500).json({ error: 'Server fout' });
  }
});

// GET bedrijfsprofiel op basis van userId (optioneel)
router.get('/company-details/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await req.db.query(
      'SELECT * FROM companies_details WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bedrijf niet gevonden' });
    }

    const bedrijf = rows[0];

    bedrijf.lookingFor = [
      bedrijf.interest_jobstudent && 'Jobstudent',
      bedrijf.interest_stage && 'Stage',
      bedrijf.interest_job && 'Voltijds personeel',
      bedrijf.interest_connect && 'Connecties'
    ].filter(Boolean);

    bedrijf.domains = [
      bedrijf.domain_data && 'Data',
      bedrijf.domain_networking && 'Netwerking',
      bedrijf.domain_ai && 'AI / Robotica',
      bedrijf.domain_software && 'Software'
    ].filter(Boolean);

    res.json(bedrijf);
  } catch (err) {
    console.error('Fout bij ophalen bedrijfsprofiel:', err);
    res.status(500).json({ error: 'Server fout' });
  }
});

// PUT bedrijfsprofiel bijwerken
router.put('/company-details/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const {
    phone_number,
    company_name,
    website,
    sector,
    booth_contact_name,
    street,
    city,
    postal_code,
    booth_contact_email,
    invoice_contact_name,
    invoice_contact_email,
    vat_number,
    lookingFor = [],
    domains = []
  } = req.body;

  // Zet booleans om naar 1 of 0 voor database
  const interest_jobstudent = lookingFor.includes('Jobstudent') ? 1 : 0;
  const interest_stage = lookingFor.includes('Stage') ? 1 : 0;
  const interest_job = lookingFor.includes('Voltijds personeel') ? 1 : 0;
  const interest_connect = lookingFor.includes('Connecties') ? 1 : 0;

  const domain_data = domains.includes('Data') ? 1 : 0;
  const domain_networking = domains.includes('Netwerking') ? 1 : 0;
  const domain_ai = domains.includes('AI / Robotica') ? 1 : 0;
  const domain_software = domains.includes('Software') ? 1 : 0;

  const sql = `
    UPDATE companies_details
    SET phone_number = ?, company_name = ?, website = ?, sector = ?,
        booth_contact_name = ?, street = ?, city = ?, postal_code = ?, booth_contact_email = ?,
        invoice_contact_name = ?, invoice_contact_email = ?, vat_number = ?,
        interest_jobstudent = ?, interest_stage = ?, interest_job = ?, interest_connect = ?,
        domain_data = ?, domain_networking = ?, domain_ai = ?, domain_software = ?
    WHERE user_id = ?
  `;

  try {
    await req.db.query(sql, [
      phone_number,
      company_name,
      website,
      sector,
      booth_contact_name,
      street,
      city,
      postal_code,
      booth_contact_email,
      invoice_contact_name,
      invoice_contact_email,
      vat_number,
      interest_jobstudent,
      interest_stage,
      interest_job,
      interest_connect,
      domain_data,
      domain_networking,
      domain_ai,
      domain_software,
      user_id
    ]);

    res.json({ message: 'Bedrijfsprofiel succesvol bijgewerkt' });
  } catch (err) {
    console.error('Fout bij bijwerken bedrijfsprofiel:', err);
    res.status(500).json({ error: 'Server fout' });
  }
});

module.exports = router;
