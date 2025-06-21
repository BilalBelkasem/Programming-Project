const db = require('../config/db');

exports.getAllCompanies = async (req, res) => {
  const sql = `
    SELECT u.id, cd.company_name 
    FROM users u
    JOIN companies_details cd ON cd.user_id = u.id
    WHERE u.role = 'bedrijf'
  `;

  try {
    const [rows] = await db.query(sql);
    const companies = rows.map(row => ({
      id: row.id,
      naam: row.company_name 
    }));
    res.json(companies);
  } catch (err) {
    console.error('Fout bij ophalen bedrijven:', err);
    return res.status(500).json({ error: 'Fout bij het ophalen van bedrijven' });
  }
};


exports.deleteCompany = async (req, res) => {
  const companyId = req.params.id;
  console.log(`DELETE request ontvangen voor company id: ${companyId}`);
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    
    await connection.query('DELETE FROM companies_details WHERE user_id = ?', [companyId]);

    
    await connection.query('DELETE FROM users WHERE id = ?', [companyId]);

    await connection.commit();
    
    console.log(`Bedrijf met id ${companyId} succesvol verwijderd.`);
    res.json({ message: 'Bedrijf succesvol verwijderd' });

  } catch (err) {
    console.error(`Fout bij verwijderen bedrijf ${companyId}:`, err);
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({ error: 'Fout bij verwijderen van het bedrijf' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
