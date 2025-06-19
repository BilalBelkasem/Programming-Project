// bedrijvenController.js

exports.getBedrijven = async (req, res) => {
  try {
    const [rows] = await req.db.execute(
      'SELECT id, company_name, sector,user_id FROM companies_details'
    );

    console.log("✅ Resultaat van de database:", rows);

    if (!Array.isArray(rows)) {
      console.error("❌ rows is geen array! Inhoud:", rows);
      return res.status(500).json({
        error: 'Fout: data is geen array',
        details: rows
      });
    }

    res.json(rows);
  } catch (err) {
    console.error('Fout bij ophalen bedrijven:', err);
    res.status(500).json({
      error: 'Fout bij ophalen bedrijven',
      details: err.message
    });
  }
};
