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
const BedrijfLikeStudentController = require('../Controller/BedrijfLikeStudentController');

// PUBLIC ROUTES
router.post('/register', StudentRegistratieController.register);
router.post('/register-company', BedrijfRegistratieController.registerCompany);
router.post('/login', LoginController.login);
router.get('/company-profile/public/:id', CompanyProfileController.getPublicCompanyProfile);

// PUBLIC API ROUTES (voor badge pagina)
router.get('/students', async (req, res) => {
  try {
    const [students] = await req.db.query(`
      SELECT u.id, u.name, s.school, s.education, s.year, u.email
      FROM users u
      JOIN students_details s ON u.id = s.user_id
      WHERE u.role = 'student'
    `);
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// PROTECTED ROUTES
router.get('/protected', authenticateToken, StudentRegistratieController.getProtectedData);
router.get('/studenten', authenticateToken, studentAdmin.getAllStudents);
router.get('/bedrijven', authenticateToken,  bedrijfAdmin.getAllCompanies);
router.delete('/bedrijven/:id', authenticateToken, bedrijfAdmin.deleteCompany);
router.get('/company-profile/:id', authenticateToken, CompanyProfileController.getCompanyProfile);
router.put('/company-profile', authenticateToken, CompanyProfileController.updateCompanyProfile);
router.get('/company-profile', authenticateToken, isCompany, CompanyProfileController.getOwnCompanyProfile);



router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Protected profile route for logged-in user', user: req.user });
});

// FAVORIETEN ROUTES via controller
router.post('/favorieten', FavorietenController.addFavoriet);
router.get('/favorieten/:studentId', FavorietenController.getFavorieten);
router.delete('/favorieten/:companyId', FavorietenController.deleteFavoriet);

// BEDRIJF LIKE STUDENT ROUTES
router.use('/bedrijf-like-student', BedrijfLikeStudentController);

// BEDRIJVEN ROUTE
router.get('/open-bedrijven', BedrijvenController.getBedrijven);
router.delete('/studenten/:id', authenticateToken, isAdmin, studentAdmin.deleteStudent);


module.exports = router;