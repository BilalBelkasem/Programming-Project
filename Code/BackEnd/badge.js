const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const renderBadgeHTML = require('./renderBadgeHTML');

// Generate PDF badge (student version)
router.get('/badge-pdf/student/:userId', async (req, res) => {
  try {
    const [userRows] = await req.db.query('SELECT * FROM users WHERE id = ?', [req.params.userId]);
    const [studentRows] = await req.db.query('SELECT * FROM students_details WHERE user_id = ?', [req.params.userId]);

    if (!userRows.length || !studentRows.length) {
      return res.status(404).send('Student not found');
    }

    // Pass user and student details separately (old format)
    const html = await renderBadgeHTML(userRows[0], studentRows[0]);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({
      format: 'A6',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=student_badge_${userRows[0].name.replace(/\s+/g, '_').toLowerCase()}.pdf`
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send('Error generating student badge PDF');
  }
});

// Generate PDF badge (company version)
router.get('/badge-pdf/company/:userId', async (req, res) => {
  try {
    // Single joined query to fetch user + company details in one go
    const [companyData] = await req.db.query(`
      SELECT 
        u.id,
        u.name AS user_name,
        u.email,
        u.role,
        c.company_name,
        c.sector,
        c.website,
        c.phone_number
      FROM users u
      JOIN companies_details c ON u.id = c.user_id
      WHERE u.id = ?
    `, [req.params.userId]);

    if (!companyData.length) {
      return res.status(404).send('Company not found');
    }

    // Pass combined data as first argument (new format)
    const html = await renderBadgeHTML(companyData[0]);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfBuffer = await page.pdf({
      format: 'A6',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=company_badge_${companyData[0].company_name.replace(/\s+/g, '_').toLowerCase()}.pdf`
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send('Error generating company badge PDF');
  }
});

// Optional test route
router.get('/test', (req, res) => {
  res.send('Badge router works!');
});

module.exports = router;
