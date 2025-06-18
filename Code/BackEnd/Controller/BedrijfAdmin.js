const db = require('../config/db');


exports.getAllCompanies = async (req, res) => {
  const sql = `
    SELECT users.id, users.name AS naam, companies_details.company_name
    FROM users
    JOIN companies_details ON companies_details.user_id = users.id
    WHERE users.role = 'bedrijf'
  `;
  try {
    const [result] = await db.query(sql);
    res.json(result);
  } catch (err) {
    console.error('Fout bij ophalen bedrijven:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.deleteCompany = async (req, res) => {
  const companyId = req.params.id;
  console.log(`DELETE request ontvangen voor company id: ${companyId}`);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    
    await connection.query('DELETE FROM companies_details WHERE user_id = ?', [companyId]);

    
    await connection.query('DELETE FROM users WHERE id = ?', [companyId]);

    await connection.commit();

    console.log(`Bedrijf met id ${companyId} succesvol verwijderd.`);
    res.json({ message: 'Bedrijf succesvol verwijderd' });
  } catch (err) {
    await connection.rollback();
    console.error('Fout bij verwijderen bedrijf:', err);
    res.status(500).json({ error: 'Fout bij verwijderen bedrijf: ' + err.message });
  } finally {
    connection.release();
  }
};
