const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authMiddleware');

const LoginController = require('../Controller/LoginController');
const StudentRegistratieController = require('../Controller/StudentRegistratieController');
const BedrijfRegistratieController = require('../Controller/BedrijfRegistratieController');
const FavorietenController = require('../Controller/FavorietenController');
const BedrijvenController = require('../Controller/BedrijvenController'); // ✅ dit toegevoegd

// PUBLIC ROUTES
router.post('/register', StudentRegistratieController.register);
router.post('/register-company', BedrijfRegistratieController.registerCompany);
router.post('/login', LoginController.login);

// PROTECTED ROUTES
router.get('/protected', authenticateToken, StudentRegistratieController.getProtectedData);

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Protected profile route for logged-in user', user: req.user });
});

// FAVORIETEN ROUTES via controller
router.post('/favorieten', FavorietenController.addFavoriet);
router.get('/favorieten/:studentId', FavorietenController.getFavorieten);
router.delete('/favorieten/:companyId', FavorietenController.deleteFavoriet);

// ✅ BEDRIJVEN ROUTE
router.get('/bedrijven', BedrijvenController.getBedrijven);

module.exports = router;
