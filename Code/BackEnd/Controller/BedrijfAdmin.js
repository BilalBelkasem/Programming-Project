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
  const companyUserId = req.params.id;
  console.log(`DELETE request ontvangen voor company id: ${companyUserId}`);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Get the companies_details.id for this user
    const [rows] = await connection.query(
      'SELECT id FROM companies_details WHERE user_id = ?',
      [companyUserId]
    );
    if (rows.length === 0) {
      throw new Error('Company not found');
    }
    const companyId = rows[0].id;

    // 2. Delete all favorites referencing this company
    await connection.query('DELETE FROM favorites WHERE company_id = ?', [companyId]);

    // 3. Delete from other related tables if needed (e.g. timeslots)
    await connection.query('DELETE FROM timeslots WHERE company_id = ?', [companyId]);

    // 4. Delete company details and user
    await connection.query('DELETE FROM companies_details WHERE user_id = ?', [companyUserId]);
    await connection.query('DELETE FROM users WHERE id = ?', [companyUserId]);

    await connection.commit();
    console.log(`Bedrijf met id ${companyUserId} succesvol verwijderd.`);
    res.json({ message: 'Bedrijf succesvol verwijderd' });
  } catch (err) {
    await connection.rollback();
    console.error('Fout bij verwijderen bedrijf:', err);
    res.status(500).json({ error: 'Fout bij verwijderen bedrijf: ' + err.message });
  } finally {
    connection.release();
  }
};
