const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const LoginController = require('../Controller/LoginController'); // If you have this
const studentRegistratieController = require('../Controller/StudentRegistratieController');

// Auth routes
router.post('/register', studentRegistratieController.register);
router.post('/login', LoginController.login);

// Protected route
router.get('/protected', authenticateToken, studentRegistratieController.getProtectedData);

module.exports = router;
