const db = require('../config/db');

exports.getBedrijven = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, company_name AS naam, sector AS beschrijving,FROM companies_details'
    );

    const bedrijven = rows.map(b => ({
      ...b,
      tags: typeof b.tags === 'string' ? b.tags.split(',') : []
    }));

    res.json(bedrijven);
  } catch (err) {
    console.error('Fout bij ophalen bedrijven:', err);
    res.status(500).json({ error: 'Fout bij ophalen bedrijven', details: err.message });
  }
};
