const db = require('../config/db');
const BedrijvenController = require('./BedrijvenController');

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
  const companyUserId = req.params.id;
  console.log(`DELETE request ontvangen voor company id: ${companyUserId}`);
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    
    const [rows] = await connection.query(
      'SELECT id FROM companies_details WHERE user_id = ?',
      [companyUserId]
    );
    if (rows.length === 0) {
      throw new Error('Bedrijf niet gevonden');
    }
    const companyDetailsId = rows[0].id;

    
    await connection.query('DELETE FROM feedback WHERE company_id = ?', [companyDetailsId]);

    
    await connection.query('DELETE FROM stands WHERE company_id = ?', [companyDetailsId]);

    
    await connection.query('DELETE FROM companies_details WHERE user_id = ?', [companyUserId]);

   
    await connection.query('DELETE FROM users WHERE id = ?', [companyUserId]);

    await connection.commit();

    // Invalidate cache since we deleted a company
    BedrijvenController.invalidateCache();

    console.log(`Bedrijf met id ${companyUserId} succesvol verwijderd.`);
    res.json({ message: 'Bedrijf succesvol verwijderd' });

  } catch (err) {
    console.error(`Fout bij verwijderen bedrijf ${companyUserId}:`, err);
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
