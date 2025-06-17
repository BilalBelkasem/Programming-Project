// controllers/BedrijfProfiel.js
const express = require('express');
const router = express.Router();

// GET bedrijfsprofiel
router.get('/company-details/:companyId', async (req, res) => {
  const { companyId } = req.params;

  try {
    const [rows] = await req.db.query(
      'SELECT * FROM companies_details WHERE id = ?',
      [companyId]
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
router.put('/company-details/:companyId', async (req, res) => {
  const { companyId } = req.params;
  const {
    email,
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

  const interest_jobstudent = lookingFor.includes('Jobstudent');
  const interest_stage = lookingFor.includes('Stage');
  const interest_job = lookingFor.includes('Voltijds personeel');
  const interest_connect = lookingFor.includes('Connecties');

  const domain_data = domains.includes('Data');
  const domain_networking = domains.includes('Netwerking');
  const domain_ai = domains.includes('AI / Robotica');
  const domain_software = domains.includes('Software');

  const sql = `
    UPDATE companies_details
    SET email = ?, phone_number = ?, company_name = ?, website = ?, sector = ?,
        booth_contact_name = ?, street = ?, city = ?, postal_code = ?, booth_contact_email = ?,
        invoice_contact_name = ?, invoice_contact_email = ?, vat_number = ?,
        interest_jobstudent = ?, interest_stage = ?, interest_job = ?, interest_connect = ?,
        domain_data = ?, domain_networking = ?, domain_ai = ?, domain_software = ?
    WHERE id = ?
  `;

  try {
    await req.db.query(sql, [
      email,
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
      companyId
    ]);

    res.json({ message: 'Bedrijfsprofiel succesvol bijgewerkt' });
  } catch (err) {
    console.error('Fout bij bijwerken bedrijfsprofiel:', err);
    res.status(500).json({ error: 'Server fout' });
  }
});

module.exports = router;
