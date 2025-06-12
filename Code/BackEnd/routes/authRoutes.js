const express = require('express');
const router = express.Router();

//  Middleware
const authenticateToken = require('../middleware/authMiddleware');

//  Controllers
const LoginController = require('../Controller/LoginController');
const StudentRegistratieController = require('../Controller/StudentRegistratieController');
const BedrijfRegistratieController = require('../Controller/BedrijfRegistratieController');

//  PUBLIC ROUTES
router.post('/register', StudentRegistratieController.register);           
router.post('/register-company', BedrijfRegistratieController.registerCompany); 
router.post('/login', LoginController.login);                             

//  PROTECTED ROUTES
router.get('/protected', authenticateToken, StudentRegistratieController.getProtectedData);

//  You can now safely add more protected routes like:
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Protected profile route for logged-in user', user: req.user });
});


module.exports = router;
