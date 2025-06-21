const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { authenticateToken } = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Verify admin password against the currently logged-in admin
const verifyAdminPassword = async (password, adminId) => {
  try {
    const [adminUser] = await db.query(
      'SELECT password_hash FROM users WHERE id = ? AND role = "admin"',
      [adminId]
    );
    
    if (adminUser.length === 0) {
      return false; // User not found or is not an admin
    }
    
    return await bcrypt.compare(password, adminUser[0].password_hash);
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return false;
  }
};

// Preview changes - count affected reservations
router.post('/preview', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { startTime, endTime, adminPassword } = req.body;

    // Validate input
    if (!startTime || !endTime || !adminPassword) {
      return res.status(400).json({ error: 'Alle velden zijn verplicht' });
    }

    // Verify admin password for the logged-in admin
    const isPasswordValid = await verifyAdminPassword(adminPassword, req.user.id);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Onjuist admin wachtwoord' });
    }

    // Get current config
    const [currentConfig] = await db.query(
      'SELECT start_uur, eind_uur FROM speeddates_config WHERE actief = 1 LIMIT 1'
    );

    if (currentConfig.length === 0) {
      return res.status(404).json({ error: 'Geen actieve configuratie gevonden' });
    }

    const currentStart = currentConfig[0].start_uur;
    const currentEnd = currentConfig[0].eind_uur;

    // Count reservations that would be affected
    const [affectedReservations] = await db.query(`
      SELECT COUNT(*) as count
      FROM speeddates 
      WHERE status = 'booked' 
      AND (
        begin_tijd < ? OR eind_tijd > ?
      )
    `, [startTime, endTime]);

    res.json({
      currentStart: currentStart,
      currentEnd: currentEnd,
      newStart: startTime,
      newEnd: endTime,
      affectedReservations: affectedReservations[0].count
    });

  } catch (error) {
    console.error('Error previewing changes:', error);
    res.status(500).json({ error: 'Fout bij het controleren van wijzigingen' });
  }
});

// Update speeddate configuration
router.post('/update', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { startTime, endTime, adminPassword } = req.body;

    // Validate input
    if (!startTime || !endTime || !adminPassword) {
      return res.status(400).json({ error: 'Alle velden zijn verplicht' });
    }

    // Verify admin password for the logged-in admin
    const isPasswordValid = await verifyAdminPassword(adminPassword, req.user.id);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Onjuist admin wachtwoord' });
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update the configuration
      await connection.query(`
        UPDATE speeddates_config 
        SET start_uur = ?, eind_uur = ?, aangepast_op = NOW()
        WHERE actief = 1
      `, [startTime, endTime]);

      // The trigger will automatically call SynchroniseerSpeeddatesMetConfig()
      // which will handle cancelling affected reservations and regenerating slots

      await connection.commit();
      res.json({ message: 'Speeddate configuratie succesvol bijgewerkt' });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error updating speeddate config:', error);
    res.status(500).json({ error: 'Fout bij het bijwerken van configuratie' });
  }
});

module.exports = router; 