const db = require('../config/db');


exports.getAllCompanies = (req, res) => {
  const sql = `
    SELECT users.id, users.name AS naam, companies_details.company_name
    FROM users
    JOIN companies_details ON companies_details.user_id = users.id
    WHERE users.role = 'bedrijf'
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Fout bij ophalen bedrijven:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
};


exports.deleteCompany = (req, res) => {
  const companyId = req.params.id;
  console.log(`DELETE request ontvangen voor company id: ${companyId}`);

  db.beginTransaction(err => {
    if (err) {
      console.error('Fout bij starten transaction:', err);
      return res.status(500).json({ error: 'Fout bij starten database transaction' });
    }

    // Step 1: Delete from companies_details
    db.query('DELETE FROM companies_details WHERE user_id = ?', [companyId], (err) => {
      if (err) {
        console.error('Fout bij verwijderen company details:', err);
        return db.rollback(() => {
          res.status(500).json({ error: 'Fout bij verwijderen company details: ' + err.message });
        });
      }

      // Step 2: Delete from users
      db.query('DELETE FROM users WHERE id = ?', [companyId], (err2) => {
        if (err2) {
          console.error('Fout bij verwijderen gebruiker:', err2);
          return db.rollback(() => {
            res.status(500).json({ error: 'Fout bij verwijderen gebruiker: ' + err2.message });
          });
        }

        db.commit(commitErr => {
          if (commitErr) {
            console.error('Fout bij commit van transaction:', commitErr);
            return db.rollback(() => {
              res.status(500).json({ error: 'Fout bij commit van transaction' });
            });
          }

          console.log(`Bedrijf met id ${companyId} succesvol verwijderd.`);
          res.json({ message: 'Bedrijf succesvol verwijderd' });
        });
      });
    });
  });
};
