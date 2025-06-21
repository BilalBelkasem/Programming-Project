const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/authMiddleware');

// Get current user's reservations
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    
    const [reservations] = await db.query(`
      SELECT 
        r.id, 
        r.slot_id, 
        t.datetime as slot_datetime,
        t.start_time, 
        t.end_time,
        c.id as company_id, 
        c.company_name,
        c.description as company_description
      FROM reservations r
      JOIN timeslots t ON r.slot_id = t.id
      JOIN companies_details c ON t.company_id = c.id
      WHERE r.student_id = ?
      ORDER BY t.datetime ASC
    `, [studentId]);

    res.json(reservations);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new reservation
// routes/reservationsRoutes.js
router.post('/', authenticateToken, async (req, res) => {
  const { slot_id } = req.body; // Match your DB column name
  const student_id = req.user.id;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    
    // Check slot availability
    const [slot] = await conn.query(
      `SELECT * FROM timeslots WHERE id = ? AND available = 1 FOR UPDATE`,
      [slot_id]
    );
    
    if (!slot.length) {
      return res.status(400).json({ error: 'Slot not available' });
    }

    // Create reservation
    const [result] = await conn.query(
      `INSERT INTO reservations (slot_id, student_id) VALUES (?, ?)`,
      [slot_id, student_id]
    );

    // Update slot availability
    await conn.query(
      `UPDATE timeslots SET available = 0 WHERE id = ?`,
      [slot_id]
    );

    await conn.commit();
    res.status(201).json({ 
      id: result.insertId,
      message: 'Reservation created'
    });
  } catch (err) {
    await conn.rollback();
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    conn.release();
  }
});

// Cancel reservation
router.delete('/:id', authenticateToken, async (req, res) => {
  const reservationId = req.params.id;
  const studentId = req.user.id;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Verify ownership and get slot ID
    const [reservation] = await conn.query(
      `SELECT slot_id FROM reservations 
       WHERE id = ? AND student_id = ?
       FOR UPDATE`,
      [reservationId, studentId]
    );

    if (reservation.length === 0) {
      return res.status(404).json({ error: 'Reservation not found or not authorized' });
    }

    const slotId = reservation[0].slot_id;

    // 2. Delete reservation
    await conn.query(
      `DELETE FROM reservations 
       WHERE id = ?`,
      [reservationId]
    );

    // 3. Mark slot as available
    await conn.query(
      `UPDATE timeslots SET available = 1 
       WHERE id = ?`,
      [slotId]
    );

    await conn.commit();
    res.json({ message: 'Reservation cancelled successfully' });
  } catch (err) {
    await conn.rollback();
    console.error('Error cancelling reservation:', err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    conn.release();
  }
});

module.exports = router;