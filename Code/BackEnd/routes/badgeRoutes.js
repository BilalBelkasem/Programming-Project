const express = require('express');
const router = express.Router();
const badgeController = require('../Controller/BadgeController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/badge-pdf/student/:userId', authenticateToken, badgeController.generateStudentBadge);
router.get('/badge-pdf/company/:userId', authenticateToken, badgeController.generateCompanyBadge);

module.exports = router;