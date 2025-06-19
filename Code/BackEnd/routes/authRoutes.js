const express = require('express');
const router = express.Router();

//  Middleware
const {authenticateToken, isAdmin, isCompany, isStudent } = require('../middleware/authMiddleware');

const LoginController = require('../Controller/LoginController');
const StudentRegistratieController = require('../Controller/StudentRegistratieController');
const BedrijfRegistratieController = require('../Controller/BedrijfRegistratieController');
const FavorietenController = require('../Controller/FavorietenController');
const BedrijvenController = require('../Controller/BedrijvenController'); // ✅ dit toegevoegd
const studentAdmin = require('../Controller/StudentAdmin');
const bedrijfAdmin = require('../Controller/BedrijfAdmin');
const CompanyProfileController = require('../Controller/companyProfileController');
const MijnProfielController = require('../Controller/mijnprofiel');

// PUBLIC ROUTES
router.post('/register', StudentRegistratieController.register);
router.post('/register-company', BedrijfRegistratieController.registerCompany);
router.post('/login', LoginController.login);
router.get('/bedrijfprofiel/:id', CompanyProfileController.getCompanyProfileById);

// PROTECTED ROUTES
router.get('/protected', authenticateToken, StudentRegistratieController.getProtectedData);
router.get('/studenten', authenticateToken, studentAdmin.getAllStudents);
router.get('/bedrijven', authenticateToken,  bedrijfAdmin.getAllCompanies);
router.delete('/bedrijven/:id', authenticateToken, bedrijfAdmin.deleteCompany);
router.get('/company-profile', authenticateToken, isCompany, CompanyProfileController.getCompanyProfile);
router.put('/company-profile', authenticateToken, CompanyProfileController.updateCompanyProfile);



router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Protected profile route for logged-in user', user: req.user });
});

// FAVORIETEN ROUTES via controller
router.post('/favorieten', FavorietenController.addFavoriet);
router.get('/favorieten/:studentId', FavorietenController.getFavorieten);
router.delete('/favorieten/:companyId', FavorietenController.deleteFavoriet);

// BEDRIJVEN ROUTE
router.get('/open-bedrijven', BedrijvenController.getBedrijven);


module.exports = router;