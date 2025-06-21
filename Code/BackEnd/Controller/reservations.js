const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, isCompany, isStudent } = require('../middleware/authMiddleware');

// GET all reservations for the logged-in company
router.get('/company/me', authenticateToken, isCompany, async (req, res) => {
    try {
        const [companyDetails] = await db.query('SELECT id FROM companies_details WHERE user_id = ?', [req.user.id]);

        if (companyDetails.length === 0) {
            return res.status(404).json({ error: 'Company details not found' });
        }

        const companyId = companyDetails[0].id;

        const [reservations] = await db.query(`
            SELECT 
                s.date_id as _id,
                TIME_FORMAT(s.begin_tijd, '%H:%i') as startTime,
                TIME_FORMAT(s.eind_tijd, '%H:%i') as endTime,
                u.name as studentName,
                sd.school as studentSchool,
                sd.education as studentEducation
            FROM speeddates s
            JOIN students_details sd ON s.student_id = sd.id
            JOIN users u ON sd.user_id = u.id
            WHERE s.company_id = ? AND s.bezet = 1
            ORDER BY s.begin_tijd
        `, [companyId]);
        
        res.json(reservations);
    } catch (err) {
        console.error('Error fetching company reservations:', err);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

// GET speeddate event configuration
router.get('/config', authenticateToken, async (req, res) => {
    try {
        const [config] = await db.query('SELECT TIME_FORMAT(start_uur, "%H:%i") as start, TIME_FORMAT(eind_uur, "%H:%i") as end FROM speeddates_config WHERE actief = 1 LIMIT 1');
        if (config.length === 0) {
            return res.status(404).json({ error: 'Active speeddate configuration not found.' });
        }
        res.json(config[0]);
    } catch (err) {
        console.error('Error fetching speeddate config:', err);
        res.status(500).json({ error: 'Failed to fetch configuration' });
    }
});

// GET all reservations for the logged-in user
router.get('/user/me', authenticateToken, isStudent, async (req, res) => {
    try {
        // Get student details ID from user ID
        const [studentDetails] = await db.query('SELECT id FROM students_details WHERE user_id = ?', [req.user.id]);
        
        if (studentDetails.length === 0) {
            return res.status(404).json({ error: 'Student details not found' });
        }
        
        const studentId = studentDetails[0].id;
        
        const [reservations] = await db.query(`
            SELECT 
                s.date_id as _id,
                TIME_FORMAT(s.begin_tijd, '%H:%i') as time,
                cd.company_name
            FROM speeddates s
            JOIN companies_details cd ON s.company_id = cd.id
            WHERE s.student_id = ?
            ORDER BY s.begin_tijd
        `, [studentId]);

        const formattedReservations = reservations.map(r => ({
            _id: r._id,
            time: r.time,
            company: { name: r.company_name }
        }));

        res.json(formattedReservations);
    } catch (err) {
        console.error('Error fetching user reservations:', err);
        res.status(500).json({ error: 'Failed to fetch reservations' });
    }
});

// POST a new reservation
router.post('/', authenticateToken, isStudent, async (req, res) => {
    const { slotId, companyId } = req.body;
    
    try {
        // Get student details ID from user ID
        const [studentDetails] = await db.query('SELECT id FROM students_details WHERE user_id = ?', [req.user.id]);
        
        if (studentDetails.length === 0) {
            return res.status(404).json({ error: 'Student details not found' });
        }
        
        const studentId = studentDetails[0].id;

        // Correctly check if the student already has a reservation with this company
        const [existingReservation] = await db.query(
            'SELECT date_id FROM speeddates WHERE company_id = ? AND student_id = ?',
            [companyId, studentId]
        );

        if (existingReservation.length > 0) {
            return res.status(409).json({ error: 'Je hebt al een reservatie met dit bedrijf.' });
        }
        
        const [slots] = await db.query('SELECT * FROM speeddates WHERE date_id = ? AND bezet = 0', [slotId]);
        if (slots.length === 0) {
            return res.status(409).json({ error: 'This time slot is no longer available.' });
        }

        await db.query(`
            UPDATE speeddates 
            SET student_id = ?, bezet = 1, gereserveerd_op = NOW() 
            WHERE date_id = ?
        `, [studentId, slotId]);

        const [newReservation] = await db.query(`
            SELECT 
                s.date_id as _id,
                TIME_FORMAT(s.begin_tijd, '%H:%i') as time,
                cd.company_name
            FROM speeddates s
            JOIN companies_details cd ON s.company_id = cd.id
            WHERE s.date_id = ?
        `, [slotId]);

        const formattedReservation = {
            _id: newReservation[0]._id,
            time: newReservation[0].time,
            company: { name: newReservation[0].company_name }
        };

        res.status(201).json(formattedReservation);
    } catch (err) {
        console.error('Error creating reservation:', err);
        res.status(500).json({ error: 'Failed to create reservation' });
    }
});

// DELETE a reservation
router.delete('/:id', authenticateToken, isStudent, async (req, res) => {
    const { id } = req.params;
    
    try {
        // Get student details ID from user ID
        const [studentDetails] = await db.query('SELECT id FROM students_details WHERE user_id = ?', [req.user.id]);
        
        if (studentDetails.length === 0) {
            return res.status(404).json({ error: 'Student details not found' });
        }
        
        const studentId = studentDetails[0].id;

        const [result] = await db.query(`
            UPDATE speeddates 
            SET student_id = NULL, bezet = 0, gereserveerd_op = NULL
            WHERE date_id = ? AND student_id = ?
        `, [id, studentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Reservation not found or you do not have permission to cancel it.' });
        }

        res.status(204).send();
    } catch (err) {
        console.error('Error canceling reservation:', err);
        res.status(500).json({ error: 'Failed to cancel reservation' });
    }
});

module.exports = router; 