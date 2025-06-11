const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const renderBadgeHTML = require('./renderBadgeHTML');

// Get all badge templates
router.get('/templates', async (req, res) => {
  try {
    const [badges] = await req.db.query('SELECT * FROM badges');
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Assign badge to user
router.post('/assign', async (req, res) => {
  const { userId, badgeId, customName, customTitle, customOrganization } = req.body;
  
  try {
    const qrData = `BADGE-${Date.now()}-${userId}-${badgeId}`;
    
    const [result] = await req.db.query(`
      INSERT INTO badge_assignments 
      (badge_id, user_id, qr_code_data, custom_name, custom_title, custom_organization, assigned_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [badgeId, userId, qrData, customName, customTitle, customOrganization, 1]);
    
    res.json({ 
      success: true,
      assignmentId: result.insertId,
      qrCodeData: qrData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get badges for specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const [badges] = await req.db.query(`
      SELECT ba.*, b.* 
      FROM badge_assignments ba
      JOIN badges b ON ba.badge_id = b.id
      WHERE ba.user_id = ?
    `, [req.params.userId]);
    
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get HTML representation of badge
router.get('/:id/html', async (req, res) => {
  try {
    const [assignments] = await req.db.query(`
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

// Generate PDF badge (student version)
router.get('/badge-pdf/student/:userId', async (req, res) => {
  try {
    const [userRows] = await req.db.query('SELECT * FROM users WHERE id = ?', [req.params.userId]);
    const [studentRows] = await req.db.query('SELECT * FROM students_details WHERE user_id = ?', [req.params.userId]);

    if (!userRows.length || !studentRows.length) {
      return res.status(404).send('Student not found');
    }

    const html = await renderBadgeHTML(userRows[0], studentRows[0]);
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=student_badge_${userRows[0].name}.pdf`
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send('Error generating PDF');
  }
});

// Generate PDF badge (assigned badge version)
router.get('/badge-pdf/:id', async (req, res) => {
  try {
    const [assignments] = await req.db.query(`
      SELECT ba.*, b.*, u.name as user_name
      FROM badge_assignments ba
      JOIN badges b ON ba.badge_id = b.id
      JOIN users u ON ba.user_id = u.id
      WHERE ba.id = ?
    `, [req.params.id]);

    if (assignments.length === 0) return res.status(404).send('Badge not found');

    const html = await renderBadgeHTML(assignments[0]);
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      printBackground: true 
    });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=badge_${assignments[0].id}.pdf`
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send('Error generating PDF');
  }
});

// Test route
router.get('/test', (req, res) => {
  res.send('Badge router works!');
});

module.exports = router;