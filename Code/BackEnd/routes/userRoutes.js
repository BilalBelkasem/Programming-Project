const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, userController.getUsers);
router.get('/studenten', authenticateToken, userController.getStudentDetails);
router.delete('/studenten/:id', authenticateToken, userController.deleteStudent);

module.exports = router;