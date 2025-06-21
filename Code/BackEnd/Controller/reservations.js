const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, isCompany, isStudent } = require('../middleware/authMiddleware');

// GET all reservations for the logged-in company
router.get('/company/me', authenticateToken, isCompany, async (req, res) => {
    try {
        const [companyDetails] = await db.query('SELECT id FROM companies_details WHERE user_id = ?', [req.user.id]);
        if (companyDetails.length === 0) return res.status(404).json({ error: 'Company details not found' });
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
            WHERE s.company_id = ? AND s.status = 'booked'
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

// GET all reservations for the logged-in user (student)
router.get('/user/me', authenticateToken, isStudent, async (req, res) => {
    try {
        const [studentDetails] = await db.query('SELECT id FROM students_details WHERE user_id = ?', [req.user.id]);
        if (studentDetails.length === 0) return res.status(404).json({ error: 'Student details not found' });
        const studentId = studentDetails[0].id;
        
        const [reservations] = await db.query(`
            SELECT 
                s.date_id as _id,
                TIME_FORMAT(s.begin_tijd, '%H:%i') as time,
                cd.company_name,
                s.status,
                s.cancellation_reason
            FROM speeddates s
            JOIN companies_details cd ON s.company_id = cd.id
            WHERE s.student_id = ?
            ORDER BY s.begin_tijd
        `, [studentId]);

        const formattedReservations = reservations.map(r => ({
            _id: r._id,
            time: r.time,
            company: { name: r.company_name },
            status: r.status,
            cancellationReason: r.cancellation_reason
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
        const [studentDetails] = await db.query('SELECT id FROM students_details WHERE user_id = ?', [req.user.id]);
        if (studentDetails.length === 0) return res.status(404).json({ error: 'Student details not found' });
        const studentId = studentDetails[0].id;

        const [existingReservation] = await db.query(
            'SELECT date_id FROM speeddates WHERE company_id = ? AND student_id = ? AND status IN ("booked", "cancelled_by_admin")',
            [companyId, studentId]
        );

        if (existingReservation.length > 0) {
            return res.status(409).json({ error: 'Je hebt al een reservatie met dit bedrijf.' });
        }
        
        const [slots] = await db.query('SELECT * FROM speeddates WHERE date_id = ? AND status = "available"', [slotId]);
        if (slots.length === 0) {
            return res.status(409).json({ error: 'This time slot is no longer available.' });
        }

        await db.query(`
            UPDATE speeddates 
            SET student_id = ?, status = 'booked', gereserveerd_op = NOW() 
            WHERE date_id = ?
        `, [studentId, slotId]);

        const [newReservation] = await db.query(`
            SELECT s.date_id as _id, TIME_FORMAT(s.begin_tijd, '%H:%i') as time, cd.company_name, s.status
            FROM speeddates s
            JOIN companies_details cd ON s.company_id = cd.id
            WHERE s.date_id = ?
        `, [slotId]);

        res.status(201).json({
            _id: newReservation[0]._id,
            time: newReservation[0].time,
            company: { name: newReservation[0].company_name },
            status: newReservation[0].status
        });
    } catch (err) {
        console.error('Error creating reservation:', err);
        res.status(500).json({ error: 'Failed to create reservation' });
    }
});

// DELETE a reservation
router.delete('/:id', authenticateToken, isStudent, async (req, res) => {
    const { id } = req.params;
    
    try {
        console.log(`DELETE request for reservation ID: ${id}`);
        const [studentDetails] = await db.query('SELECT id FROM students_details WHERE user_id = ?', [req.user.id]);
        if (studentDetails.length === 0) return res.status(404).json({ error: 'Student details not found' });
        const studentId = studentDetails[0].id;

        const [reservation] = await db.query('SELECT status FROM speeddates WHERE date_id = ? AND student_id = ?', [id, studentId]);

        if (reservation.length === 0) {
            console.log(`Reservation not found for ID: ${id}, student: ${studentId}`);
            return res.status(404).json({ error: 'Reservation not found or you do not have permission to cancel it.' });
        }

        const currentStatus = reservation[0].status;
        console.log(`Reservation status: ${currentStatus}`);

        if (currentStatus === 'cancelled_by_admin') {
            console.log(`Deleting cancelled reservation ID: ${id}`);
            const result = await db.query('DELETE FROM speeddates WHERE date_id = ?', [id]);
            console.log(`Delete result:`, result);
        } else if (currentStatus === 'booked') {
            console.log(`Making booked reservation available again ID: ${id}`);
            await db.query(`
                UPDATE speeddates 
                SET student_id = NULL, status = 'available', gereserveerd_op = NULL, cancellation_reason = NULL
                WHERE date_id = ?
            `, [id]);
        } else {
            console.log(`Invalid status: ${currentStatus}`);
            return res.status(400).json({ error: 'Invalid reservation state for cancellation.' });
        }

        res.status(204).send();
    } catch (err) {
        console.error('Error canceling reservation:', err);
        res.status(500).json({ error: 'Failed to cancel reservation' });
    }
});

module.exports = router; 