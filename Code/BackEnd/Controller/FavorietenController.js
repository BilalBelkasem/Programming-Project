// favorietenController.js

exports.addFavoriet = async (req, res) => {
  const { student_id, company_id } = req.body;
  try {
    // 1. Check if the favorite already exists
    const [existing] = await req.db.execute(
      'SELECT id FROM favorites WHERE student_id = ? AND company_id = ?',
      [student_id, company_id]
    );

    if (existing.length > 0) {
      return res.status(200).json({ message: 'Favoriet bestaat al.' });
    }

    // 2. If not, insert the new favorite
    await req.db.execute(
      'INSERT INTO favorites (student_id, company_id, bedrijf_liked_student) VALUES (?, ?, 0)', // Expliciet op 0 zetten
      [student_id, company_id]
    );
    res.status(201).json({ message: 'Favoriet toegevoegd!' });
  } catch (err) {
    console.error('SQL-fout bij toevoegen favoriet:', err);
    res.status(500).json({ error: 'Fout bij toevoegen favoriet', details: err.message });
  }
};

exports.getFavorieten = async (req, res) => {
  const student_id = req.params.studentId;
  try {
    const [rows] = await req.db.execute(
      `SELECT 
         c.user_id as id,
         c.company_name AS naam, 
         c.sector AS beschrijving,
         c.zoek_jobstudent,
         c.zoek_stage,
         c.zoek_job,
         c.zoek_connecties,
         c.domein_data,
         c.domein_netwerking,
         c.domein_ai,
         c.domein_software
       FROM favorites f
       JOIN companies_details c ON f.company_id = c.user_id
       WHERE f.student_id = ? AND f.bedrijf_liked_student = 0`,
      [student_id]
    );
    res.json(rows);
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
    await req.db.execute(
      'DELETE FROM favorites WHERE student_id = ? AND company_id = ?',
      [student_id, company_id]
    );
    res.status(200).json({ message: 'Favoriet verwijderd' });
  } catch (err) {
    console.error('SQL-fout bij verwijderen favoriet:', err);
    res.status(500).json({ error: 'Fout bij verwijderen favoriet', details: err.message });
  }
};
