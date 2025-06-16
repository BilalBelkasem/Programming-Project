const express = require('express');
const router = express.Router();
const studentController = require('../Controller/studentController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Existing routes
// Change studentRoutes.js
router.get('/', authenticateToken, studentController.getStudentDetails); // Use existing function

// New routes from server.js
router.get('/studenten', authenticateToken, studentController.getStudentDetails);
router.delete('/studenten/:id', authenticateToken, studentController.deleteStudent);

module.exports = router;