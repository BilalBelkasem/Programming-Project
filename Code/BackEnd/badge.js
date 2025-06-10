const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const renderBadgeHTML = require('../BackEnd/renderBadgeHTML');
const db = require("../BackEnd/db");

// Your existing PDF route
router.get('/badge-pdf/:userId', async (req, res) => {
    console.log("Badge PDF route called");
    const { userId } = req.params;
    console.log('UserId: ', userId);

    try {
        const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        const [studentRows] = await db.query('SELECT * FROM students_details WHERE user_id = ?', [userId]);

        console.log('User rows: ', userRows);
        console.log('Student rows: ', studentRows);
        console.log('Fetching data for userId: ', userId);

        if (!userRows.length || !studentRows.length) return res.status(404).send('Student not found');

        let html;
        try {
            html = await renderBadgeHTML(userRows[0], studentRows[0]);
            console.log('HTML generated successfully');
        } catch (e) {
            console.error('HTML render error:', e);
            return res.status(500).send('HTML render failed');
        }
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();

        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        res.set({
            'Content-type': 'application/pdf',
            'Content-Disposition': `attachment; filename=badge_${userRows[0].name}.pdf`,
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error("Detailed server error: ", err.stack || err);
        res.status(500).send('Server error');
    }
});

// New functionality to add
router.get('/templates', async (req, res) => {
  try {
    const [badges] = await db.query('SELECT * FROM badges');
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/assignments', async (req, res) => {
  try {
    const [assignments] = await db.query(`
      SELECT ba.*, b.name as badge_name, b.template_type, u.name as user_name
      FROM badge_assignments ba
      JOIN badges b ON ba.badge_id = b.id
      JOIN users u ON ba.user_id = u.id
    `);
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const [badges] = await db.query(`
      SELECT ba.*, b.*, u.name as user_name
      FROM badge_assignments ba
      JOIN badges b ON ba.badge_id = b.id
      JOIN users u ON ba.user_id = u.id
      WHERE ba.user_id = ?
    `, [req.params.userId]);
    
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/assign', async (req, res) => {
  const { userId, badgeId, customName, customTitle, customOrganization } = req.body;
  
  try {
    const qrData = `BADGE-${Date.now()}-${userId}-${badgeId}`;
    
    const [result] = await db.query(`
      INSERT INTO badge_assignments 
      (badge_id, user_id, qr_code_data, custom_name, custom_title, custom_organization, assigned_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [badgeId, userId, qrData, customName, customTitle, customOrganization, 5]);
    
    res.json({ success: true, assignmentId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/html', async (req, res) => {
  try {
    const [assignments] = await db.query(`
      SELECT ba.*, b.*, u.name as user_name
      FROM badge_assignments ba
      JOIN badges b ON ba.badge_id = b.id
      JOIN users u ON ba.user_id = u.id
      WHERE ba.id = ?
    `, [req.params.id]);
    
    if (assignments.length === 0) return res.status(404).send('Badge not found');
    
    const html = await renderBadgeHTML(assignments[0]);
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Your existing test route
router.get('/test', (req, res) => {
  console.log('Badge test route hit');
  res.send('Badge router works!');
});

module.exports = router;    