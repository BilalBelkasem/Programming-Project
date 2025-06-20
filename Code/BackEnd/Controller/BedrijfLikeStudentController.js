const express = require('express');
const router = express.Router();

// Bedrijf liket student
router.post('/like', async (req, res) => {
  const { student_id, company_id } = req.body;
  try {
    // Check of deze combinatie al bestaat
    const [rows] = await req.db.query(
      'SELECT id FROM favorites WHERE student_id = ? AND company_id = ? AND bedrijf_liked_student = 1',
      [student_id, company_id]
    );
    if (rows.length > 0) {
      return res.status(200).json({ message: 'Al geliked', id: rows[0].id });
    }
    const [result] = await req.db.query(
      'INSERT INTO favorites (student_id, company_id, bedrijf_liked_student) VALUES (?, ?, 1)',
      [student_id, company_id]
    );
    res.status(201).json({ message: 'Favoriet toegevoegd', id: result.insertId });
  } catch (err) {
    console.error('SQL-fout bij toevoegen favoriet (bedrijf->student):', err);
    res.status(500).json({ error: 'Databasefout bij toevoegen favoriet' });
  }
});

// Bedrijf unliket student
router.delete('/unlike', async (req, res) => {
  const { student_id, company_id } = req.body;
  try {
    await req.db.query(
      'DELETE FROM favorites WHERE student_id = ? AND company_id = ? AND bedrijf_liked_student = 1',
      [student_id, company_id]
    );
    res.status(200).json({ message: 'Favoriet verwijderd' });
  } catch (err) {
    console.error('SQL-fout bij verwijderen favoriet (bedrijf->student):', err);
    res.status(500).json({ error: 'Fout bij verwijderen favoriet', details: err.message });
  }
});

// Check of bedrijf student al geliked heeft
router.get('/check', async (req, res) => {
  const { student_id, company_id } = req.query;
  try {
    const [rows] = await req.db.query(
      'SELECT id FROM favorites WHERE student_id = ? AND company_id = ? AND bedrijf_liked_student = 1',
      [student_id, company_id]
    );
    if (rows.length > 0) {
      res.json({ found: true, favoriteId: rows[0].id });
    } else {
      res.json({ found: false });
    }
  } catch (err) {
    console.error('SQL-fout bij checken favoriet (bedrijf->student):', err);
    res.status(500).json({ error: 'Fout bij checken favoriet', details: err.message });
  }
});

// Haal alle favoriete studenten van een bedrijf op
router.get('/favorites/:companyId', async (req, res) => {
  const { companyId } = req.params;
  try {
    const [rows] = await req.db.query(
      `SELECT 
         u.id, 
         u.name AS full_name, 
         s.school, 
         s.education, 
         s.year, 
         s.about, 
         s.linkedin_url
       FROM favorites f
       JOIN users u ON f.student_id = u.id
       LEFT JOIN students_details s ON s.user_id = u.id
       WHERE f.company_id = ? AND f.bedrijf_liked_student = 1`,
      [companyId]
    );
    res.json(rows);
  } catch (err) {
    console.error('SQL-fout bij ophalen favoriete studenten:', err);
    res.status(500).json({ error: 'Fout bij ophalen favoriete studenten', details: err.message });
  }
});

module.exports = router; 