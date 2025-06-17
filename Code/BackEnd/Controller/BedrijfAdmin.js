const db = require('../config/db');

// ✅ Ophalen van alle bedrijven (mysql2/promise syntax)
exports.getAllCompanies = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT users.id, users.name AS naam, companies_details.company_name
      FROM users
      JOIN companies_details ON companies_details.user_id = users.id
      WHERE users.role = 'bedrijf'
    `);
    res.json(result);
  } catch (err) {
    console.error('Fout bij ophalen bedrijven:', err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Verwijderen van een bedrijf met transaction
exports.deleteCompany = async (req, res) => {
  const companyId = req.params.id;
  console.log(`DELETE request ontvangen voor company id: ${companyId}`);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('DELETE FROM companies_details WHERE user_id = ?', [companyId]);
    await conn.query('DELETE FROM users WHERE id = ?', [companyId]);

    await conn.commit();
    console.log(`Bedrijf met id ${companyId} succesvol verwijderd.`);
    res.json({ message: 'Bedrijf succesvol verwijderd' });
  } catch (err) {
    await conn.rollback();
    console.error('Fout bij verwijderen bedrijf:', err);
    res.status(500).json({ error: 'Fout bij verwijderen bedrijf: ' + err.message });
  } finally {
    conn.release();
  }
};
