const BadgeService = require('../services/BadgeService');

exports.generateStudentBadge = async (req, res) => {
  try {
    const pdfBuffer = await BadgeService.generateStudentBadge(req.db, req.params.userId);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=student_badge_${req.user.name.replace(/\s+/g, '_').toLowerCase()}.pdf`
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send('Error generating student badge PDF');
  }
};

exports.generateCompanyBadge = async (req, res) => {
  try {
    const pdfBuffer = await BadgeService.generateCompanyBadge(req.db, req.params.userId);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=company_badge_${req.user.company_name.replace(/\s+/g, '_').toLowerCase()}.pdf`
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send('Error generating company badge PDF');
  }
};