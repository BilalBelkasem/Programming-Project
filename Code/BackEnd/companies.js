const express = require('express');
const router = express.Router();
const db = require('./config/db'); // Import db connection

// GET all companies for the speeddate page
router.get('/', async (req, res) => {
  try {
    const [companies] = await db.query(`
      SELECT 
        cd.id,
        cd.company_name as name,
        cd.about as description,
        cd.sector as industry,
        cd.city as location
      FROM companies_details cd
      JOIN users u ON cd.user_id = u.id
      WHERE u.role = 'bedrijf'
    `);
    res.json(companies);
  } catch (err) {
    console.error('Error fetching companies for speeddates:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get all possible sectors (not just the ones currently in use)
router.get('/sectors', (req, res) => {
    const allSectors = [
        'Software & webontwikkeling (focus op back-end)',
        'Hardware & embedded systemen',
        'Dienstverlening & consultancy',
        'Telecom, security & infrastructuur',
        'Creatief, artistiek',
        'Web, mobile, UX (focus op front-end)',
        'Broadcast, media',
        'Marketing, full service',
        'Andere'
    ];
    res.json(allSectors);
});

module.exports = router;
