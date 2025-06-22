const express = require('express');
const router = express.Router();
const db = require('./config/db'); // Import db connection

// GET all companies for the speeddate page
router.get('/', async (req, res) => {
  try {
    const [companies] = await db.query(`
      SELECT 
        cd.user_id,
        cd.company_name
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

// GET available time slots for a specific company
router.get('/:companyId/slots', async (req, res) => {
    try {
        const { companyId } = req.params;
        const [slots] = await db.query(`
            SELECT 
                date_id as _id,
                TIME_FORMAT(begin_tijd, '%H:%i') as time
            FROM speeddates 
            WHERE company_id = ? AND status = 'available'
            ORDER BY begin_tijd
        `, [companyId]);
        
        // All slots returned are available
        res.json(slots);
    } catch (err) {
        console.error('Error fetching time slots:', err);
        res.status(500).json({ error: 'Failed to fetch time slots' });
    }
});

module.exports = router;
