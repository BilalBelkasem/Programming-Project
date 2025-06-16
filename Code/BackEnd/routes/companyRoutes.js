const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [companies] = await req.db.query(`
      SELECT 
        u.id as user_id,
        u.name AS name, 
        c.company_name as company_name, 
        c.sector 
      FROM users u
      JOIN companies_details c on u.id = c.user_id
      WHERE u.role = 'bedrijf'
    `);
    res.json(companies);
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

module.exports = router;
