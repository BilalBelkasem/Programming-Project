const express = require('express');
const router = express.Router();
const { authenticateToken, isCompany } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Get all timeslots for the authenticated company
router.get('/', authenticateToken, isCompany, async (req, res) => {
    try {
        const [company] = await db.query(
            `SELECT id FROM companies_details WHERE user_id = ?`,
            [req.user.id]
        );

        if (!company.length) {
            return res.status(403).json({ error: 'Company not found' });
        }

        const [slots] = await db.query(
            `SELECT id, start_time, end_time, available 
             FROM timeslots 
             WHERE company_id = ? 
             ORDER BY start_time`,
            [company[0].id]
        );

        // Format dates for frontend
        const formattedSlots = slots.map(slot => ({
            id: slot.id,
            date: new Date(slot.start_time).toISOString().split('T')[0],
            start_time: slot.start_time.toTimeString().substring(0, 5),
            end_time: slot.end_time.toTimeString().substring(0, 5),
            available: slot.available
        }));

        res.json(formattedSlots);
    } catch (err) {
        console.error('Error fetching slots:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create new timeslots
router.post('/', authenticateToken, isCompany, async (req, res) => {
    try {
        const { startTime, endTime } = req.body;
        const fixedDate = '2026-03-13';

        // Input validation
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

        // Generate 5-minute slots
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

                await conn.query(
                    `INSERT INTO timeslots (company_id, start_time, end_time, available)
                     VALUES (?, ?, ?, 1)`,
                    [company[0].id, current, endSlot]
                );

                slots.push({
                    start: current.toTimeString().substring(0, 5),
                    end: endSlot.toTimeString().substring(0, 5)
                });

                current = endSlot;
            }

            await conn.commit();
            res.status(201).json({ 
                message: `${slots.length} timeslots created`,
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

// Delete a timeslot
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

            // Then delete the slot
            const [result] = await conn.query(
                `DELETE FROM timeslots 
                 WHERE id = ? AND company_id = ?`,
                [slotId, company[0].id]
            );

            if (result.affectedRows === 0) {
                await conn.rollback();
                return res.status(404).json({ error: 'Timeslot not found' });
            }

            await conn.commit();
            res.json({ message: 'Timeslot deleted successfully' });
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

module.exports = router;