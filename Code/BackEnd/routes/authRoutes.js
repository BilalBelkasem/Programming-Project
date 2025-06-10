const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

// Auth routes
router.post('/login', authController.login);

// Protected route
router.get('/protected', authenticateToken, authController.getProtectedData);

module.exports = router;
