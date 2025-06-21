const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET all reservations for the logged-in user
router.get('/user/me', authenticateToken, async (req, res) => {
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
router.post('/', authenticateToken, async (req, res) => {
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
router.delete('/:id', authenticateToken, async (req, res) => {
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