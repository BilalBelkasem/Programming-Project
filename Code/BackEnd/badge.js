const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const puppeteer = require('puppeteer');
const renderBadgeHTML = require('../BackEnd/renderBadgeHTML');
const db = require("../BackEnd/db");

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
})

router.get('/test', (req, res) => {
  console.log('Badge test route hit');
  res.send('Badge router works!');
});


module.exports = router;