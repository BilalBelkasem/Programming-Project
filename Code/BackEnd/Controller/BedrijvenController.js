// bedrijvenController.js

exports.getBedrijven = async (req, res) => {
  try {
    const [bedrijven] = await req.db.query(`
      SELECT 
        u.id, 
        c.company_name, 
        c.about,
        c.sector, 
        CONCAT_WS(', ', NULLIF(c.street, ''), NULLIF(c.city, '')) as location,
        c.zoek_jobstudent, 
        c.zoek_stage, 
        c.zoek_job, 
        c.zoek_connecties, 
        c.domein_data, 
        c.domein_netwerking, 
        c.domein_ai, 
        c.domein_software 
      FROM users u 
      JOIN companies_details c ON u.id = c.user_id 
      WHERE u.role = 'bedrijf'
    `);

    console.log("✅ Resultaat van de database:", bedrijven);

    if (!Array.isArray(bedrijven)) {
      console.error("❌ bedrijven is geen array! Inhoud:", bedrijven);
      return res.status(500).json({
        error: 'Fout: data is geen array',
        details: bedrijven
      });
    }

    res.json(bedrijven);
  } catch (err) {
    console.error('Fout bij ophalen bedrijven:', err);
    res.status(500).json({
      error: 'Fout bij ophalen bedrijven',
      details: err.message
    });
  }
};
