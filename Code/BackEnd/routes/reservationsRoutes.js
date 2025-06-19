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
router.post('/', authenticateToken, async (req, res) => {
  const { slotId } = req.body;
  const studentId = req.user.id;

  if (!slotId) {
    return res.status(400).json({ error: 'Slot ID is required' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Check slot availability
    const [slot] = await conn.query(`
      SELECT t.*, c.id as company_id 
      FROM timeslots t
      JOIN companies_details c ON t.company_id = c.id
      WHERE t.id = ? AND t.available = 1
      FOR UPDATE
    `, [slotId]);
    
    if (slot.length === 0) {
      return res.status(400).json({ error: 'Slot not available' });
    }

    // 2. Check if student already has reservation at this time
    const [existing] = await conn.query(`
      SELECT r.id 
      FROM reservations r
      JOIN timeslots t ON r.slot_id = t.id
      WHERE r.student_id = ? AND t.datetime = ?
    `, [studentId, slot[0].datetime]);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'You already have a reservation at this time' });
    }

    // 3. Create reservation
    const [result] = await conn.query(
      `INSERT INTO reservations (slot_id, student_id) 
       VALUES (?, ?)`,
      [slotId, studentId]
    );

    // 4. Mark slot as unavailable
    await conn.query(
      `UPDATE timeslots SET available = 0 
       WHERE id = ?`,
      [slotId]
    );

    await conn.commit();
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Reservation created successfully',
      companyId: slot[0].company_id,
      slot: slot[0]
    });
  } catch (err) {
    await conn.rollback();
    console.error('Error creating reservation:', err);
    
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Already reserved this slot' });
    }
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