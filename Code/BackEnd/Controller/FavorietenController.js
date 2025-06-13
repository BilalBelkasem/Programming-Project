const db = require('../config/db');

exports.addFavoriet = async (req, res) => {
  const { student_id, company_id } = req.body;
  try {
    await db.execute(
      'INSERT INTO favorites (student_id, company_id) VALUES (?, ?)',
      [student_id, company_id]
    );
    res.status(200).json({ message: 'Favoriet toegevoegd!' });
  } catch (err) {
    console.error('SQL-fout bij toevoegen favoriet:', err);
    res.status(500).json({ error: 'Fout bij toevoegen favoriet', details: err.message });
  }
};

exports.getFavorieten = async (req, res) => {
  const student_id = req.params.studentId;

  try {
    const [rows] = await db.execute(
      `SELECT 
         c.id, 
         c.company_name AS naam, 
         c.sector AS beschrijving, 
         c.tags
       FROM favorites f
       JOIN companies_details c ON f.company_id = c.id
       WHERE f.student_id = ?`,
      [student_id]
    );

    const bedrijven = rows.map(b => ({
      ...b,
      tags: typeof b.tags === 'string' ? b.tags.split(',') : []
    }));

    res.json(bedrijven);
  } catch (err) {
    console.error('SQL-fout bij ophalen favorieten:', err);
    res.status(500).json({
      error: 'Fout bij ophalen favorieten',
      details: err.message
    });
  }
};

exports.deleteFavoriet = async (req, res) => {
  const { student_id } = req.query;
  const company_id = req.params.companyId;
  try {
    await db.execute(
      'DELETE FROM favorites WHERE student_id = ? AND company_id = ?',
      [student_id, company_id]
    );
    res.status(200).json({ message: 'Favoriet verwijderd' });
  } catch (err) {
    console.error('SQL-fout bij verwijderen favoriet:', err);
    res.status(500).json({ error: 'Fout bij verwijderen favoriet', details: err.message });
  }
};
