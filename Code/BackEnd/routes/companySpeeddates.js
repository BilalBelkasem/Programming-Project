const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Use the correct auth middleware - make sure this matches your authMiddleware.js
const { authenticateToken, isCompany } = require('../middleware/authMiddleware');


// GET /api/company/speeddates - Fetch timeslots for the company
router.get('/', authenticateToken, isCompany, async (req, res) => {
    console.log('Fetching slots for company ID:', req.user.id); // Debug log
    try {
        console.log('User from token:', req.user); // Debug log
        await db.query('SELECT 1');
        console.log('Database connection OK');
        const [company] = await db.query(
            `SELECT id FROM companies_details WHERE user_id = ?`,
            [req.user.id]
        );

        if (!company.length) {
            console.log('No company found for user_id:', req.user.id);
            return res.status(403).json({ error: 'Company not found' });
        }

    console.log('Company found:', company); // Debug log

        const [slots] = await db.query(
            `SELECT id, start_time, end_time, date, available 
                FROM timeslots 
                WHERE company_id = ? 
                ORDER BY date, start_time`,
            [company[0].id]
        );

        console.log('Slots found:', slots.length); // Debug log
        res.json(slots);
    } catch (err) {
        console.error('Error fetching slots:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/company/speeddates - Create new timeslots
router.post('/', authenticateToken, isCompany, async (req, res) => {
    console.log('POST /api/company/speeddates reached');
    console.log('Request body:', req.body);
    try {
        const { startTime, endTime } = req.body;
        const fixedDate = '2026-03-13';

        // Validate input
        if (!startTime || !endTime) {
            return res.status(400).json({ error: 'Start and end time required' });
        }

        const [company] = await db.query(
            `SELECT id FROM companies_details WHERE user_id = ?`,
            [req.user.id]
        );

        if (!company.length) {
            return res.status(403).json({ error: 'Company not found' });
        }

        // Generate timeslots (5 minutes interval)
        const slots = [];
        let current = new Date(`${fixedDate}T${startTime}`);
        const end = new Date(`${fixedDate}T${endTime}`);

        if (current >= end) {
            return res.status(400).json({ error: 'End time must be after start time' });
        }

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            while (current < end) {
                const endSlot = new Date(current.getTime() + 5 * 60000);
                if (endSlot > end) break;

                const startStr = current.getHours().toString().padStart(2, '0') + ':' +
                    current.getMinutes().toString().padStart(2, '0');
                const endStr = endSlot.getHours().toString().padStart(2, '0') + ':' +
                    endSlot.getMinutes().toString().padStart(2, '0');

                await conn.query(
                    `INSERT INTO timeslots 
                        (company_id, date, start_time, end_time, available)
                        VALUES (?, ?, ?, ?, ?)`,
                    [company[0].id, fixedDate, startStr, endStr, 1]
                );

                current = endSlot;
                slots.push({ start: startStr, end: endStr });
            }

            await conn.commit();
            res.status(201).json({
                message: `${slots.length} timeslots created for March 13, 2026`,
                slots: slots
            });
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    } catch (err) {
        console.error('Error creating slots:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/company/speeddates/:id - Delete a timeslot
router.delete('/:id', authenticateToken, isCompany, async (req, res) => {
    try {
        const slotId = req.params.id;
        const [company] = await db.query(
            `SELECT id FROM companies_details WHERE user_id = ?`,
            [req.user.id]
        );

        if (!company.length) {
            return res.status(403).json({ error: 'Company not found' });
        }

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // First delete related reservations
            await conn.query(
                `DELETE FROM reservations WHERE slot_id = ?`,
                [slotId]
            );

            // Then delete the timeslot
            const [result] = await conn.query(
                `DELETE FROM timeslots WHERE id = ? AND company_id = ?`,
                [slotId, company[0].id]
            );

            if (result.affectedRows === 0) {
                await conn.rollback();
                return res.status(404).json({ error: 'Timeslot not found' });
            }

            await conn.commit();
            res.json({ message: 'Slot successfully deleted' });
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    } catch (err) {
        console.error('Error deleting slot:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/company/speeddates/reservations - Get reservations for the company
router.get('/reservations', authenticateToken, isCompany, async (req, res) => {
    try {
        const [company] = await db.query(
            `SELECT id FROM companies_details WHERE user_id = ?`,
            [req.user.id]
        );

        if (!company.length) {
            return res.status(403).json({ error: 'Company not found' });
        }

        const [reservations] = await db.query(
            `SELECT r.*, s.start_time, s.end_time, s.date,
                        u.name as student_name, u.email as student_email
                FROM reservations r
                JOIN timeslots s ON r.slot_id = s.id
                LEFT JOIN users u ON r.user_id = u.id
                WHERE s.company_id = ?
                ORDER BY s.date, s.start_time`,
            [company[0].id]
        );

        res.json(reservations);
    } catch (err) {
        console.error('Error fetching reservations:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/companies/:companyId/speeddates', async (req, res) => {
  try {
    const [slots] = await db.query(`
      SELECT 
        id,
        DATE_FORMAT(start_time, '%H:%i') as start_time,
        DATE_FORMAT(end_time, '%H:%i') as end_time,
        available
      FROM timeslots
      WHERE company_id = ?
      AND date = '2026-03-13'
      ORDER BY start_time
    `, [req.params.companyId]);

    res.json(slots);
  } catch (err) {
    console.error('Error fetching public slots:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;