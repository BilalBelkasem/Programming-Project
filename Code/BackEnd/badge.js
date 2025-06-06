const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const puppeteer = require('puppeteer');
const renderBadgeHTML = require('../BackEnd/renderBadgeHTML');
const db = require("../BackEnd/db");

router.get('/badge-pdf/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        const [studentRows] = await db.query('SELECT * FROM students_details WHERE user_id = ?', [userId]);

        if (!userRows.length || !studentRows.length) return res.status(404).send('Student not found');
    

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
            'Content-type': 'application/pdf',
            'Content-Disposition': `attachment; filename=badge_${userRows[0].name}.pdf`,
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
})
module.exports = router;