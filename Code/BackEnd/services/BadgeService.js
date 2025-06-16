const puppeteer = require('puppeteer');
const renderBadgeHTML = require('./renderBadgeHTML');

class BadgeService {
  static async generateStudentBadge(db, userId) {
    const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const [studentRows] = await db.query('SELECT * FROM students_details WHERE user_id = ?', [userId]);

    if (!userRows.length || !studentRows.length) {
      throw new Error('Student not found');
    }

    const html = await renderBadgeHTML(userRows[0], studentRows[0]);
    return this._generatePDF(html);
  }

  static async generateCompanyBadge(db, userId) {
    const [companyData] = await db.query(`
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
    `, [userId]);

    if (!companyData.length) {
      throw new Error('Company not found');
    }

    const html = await renderBadgeHTML(companyData[0]);
    return this._generatePDF(html);
  }

  static async _generatePDF(html) {
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
    return pdfBuffer;
  }
}

module.exports = BadgeService;