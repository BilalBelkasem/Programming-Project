const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, isCompany, isStudent } = require('../middleware/authMiddleware');

/**
 * Entreprise : liste des réservations confirmées
 */
router.get('/company/me', authenticateToken, isCompany, async (req, res) => {
  try {
    const [companyDetails] = await db.query(
      'SELECT id FROM companies_details WHERE user_id = ?',
      [req.user.id]
    );
    if (companyDetails.length === 0) return res.status(404).json({ error: 'Company details not found' });
    const companyId = companyDetails[0].id;

    const [reservations] = await db.query(
      `
      SELECT 
        s.date_id as _id,
        TIME_FORMAT(s.begin_tijd, '%H:%i') as startTime,
        TIME_FORMAT(s.eind_tijd,  '%H:%i') as endTime,
        u.name as studentName,
        sd.school as studentSchool,
        sd.education as studentEducation
      FROM speeddates s
      JOIN students_details sd ON s.student_id = sd.id
      JOIN users u          ON sd.user_id = u.id
      WHERE s.company_id = ? AND s.status = 'booked'
      ORDER BY s.begin_tijd
      `,
      [companyId]
    );
    res.json(reservations);
  } catch (err) {
    console.error('Error fetching company reservations:', err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

/**
 * Config active (heures début/fin)
 */
router.get('/config', authenticateToken, async (req, res) => {
  try {
    const [config] = await db.query(
      'SELECT TIME_FORMAT(start_uur, "%H:%i") as start, TIME_FORMAT(eind_uur, "%H:%i") as end FROM speeddates_config WHERE actief = 1 LIMIT 1'
    );
    if (config.length === 0) {
      return res.status(404).json({ error: 'Active speeddate configuration not found.' });
    }
    res.json(config[0]);
  } catch (err) {
    console.error('Error fetching speeddate config:', err);
    res.status(500).json({ error: 'Failed to fetch configuration' });
  }
});

/**
 * Slots d’une entreprise (companyId = users.id de l’entreprise)
 * => renvoie aussi begin_tijd au format HH:MM:SS pour réserver par heure
 */
router.get('/companies/:companyId/slots', authenticateToken, async (req, res) => {
  const { companyId } = req.params; // users.id
  try {
    const [companyDetails] = await db.query(
      'SELECT id FROM companies_details WHERE user_id = ?',
      [companyId]
    );
    if (companyDetails.length === 0) return res.json([]);
    const detailsId = companyDetails[0].id;

    const [slots] = await db.query(
      `
      SELECT 
        date_id AS _id,
        TIME_FORMAT(begin_tijd, '%H:%i')    AS time,        -- affichage
        TIME_FORMAT(begin_tijd, '%H:%i:%s') AS begin_tijd,  -- pour POST /by-time
        status
      FROM speeddates
      WHERE company_id = ?
      ORDER BY begin_tijd
      `,
      [detailsId]
    );

    res.json(slots);
  } catch (err) {
    console.error(`Error fetching slots for company user_id ${companyId}:`, err);
    res.status(500).json({ error: 'Failed to fetch time slots' });
  }
});

/**
 * Mes réservations (étudiant)
 */
router.get('/user/me', authenticateToken, isStudent, async (req, res) => {
  try {
    const [studentDetails] = await db.query(
      'SELECT id FROM students_details WHERE user_id = ?',
      [req.user.id]
    );
    if (studentDetails.length === 0) return res.status(404).json({ error: 'Student details not found' });
    const studentId = studentDetails[0].id;

    const [reservations] = await db.query(
      `
      SELECT 
        s.date_id as _id,
        s.company_id,
        TIME_FORMAT(s.begin_tijd, '%H:%i') as time,
        TIME_FORMAT(s.eind_tijd,  '%H:%i') as eind_tijd,
        cd.company_name,
        s.status,
        s.cancellation_reason
      FROM speeddates s
      JOIN companies_details cd ON s.company_id = cd.id
      WHERE s.student_id = ?
      ORDER BY s.begin_tijd
      `,
      [studentId]
    );

    const formattedReservations = reservations.map(r => ({
      _id: r._id,
      company_id: r.company_id,
      time: r.time,
      eind_tijd: r.eind_tijd,
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

/**
 * (Ancienne création via date_id) — conservée pour compat
 */
router.post('/', authenticateToken, isStudent, async (req, res) => {
  const { slotId, companyId } = req.body;
  try {
    const [studentDetails] = await db.query(
      'SELECT id FROM students_details WHERE user_id = ?',
      [req.user.id]
    );
    if (studentDetails.length === 0) return res.status(404).json({ error: 'Student details not found' });
    const studentId = studentDetails[0].id;

    const detailsId = companyId;

    const [existingReservation] = await db.query(
      'SELECT date_id FROM speeddates WHERE company_id = ? AND student_id = ? AND status = "booked"',
      [detailsId, studentId]
    );
    if (existingReservation.length > 0) {
      return res.status(409).json({ error: 'Je hebt al een reservatie met dit bedrijf.' });
    }

    const [slots] = await db.query(
      'SELECT * FROM speeddates WHERE date_id = ? AND status = "available"',
      [slotId]
    );
    if (slots.length === 0) {
      return res.status(409).json({ error: 'This time slot is no longer available.' });
    }

    await db.query(
      `
      UPDATE speeddates 
      SET student_id = ?, status = 'booked', gereserveerd_op = NOW() 
      WHERE date_id = ?
      `,
      [studentId, slotId]
    );

    const [newReservation] = await db.query(
      `
      SELECT s.date_id as _id, TIME_FORMAT(s.begin_tijd, '%H:%i') as time, cd.company_name, s.status
      FROM speeddates s
      JOIN companies_details cd ON s.company_id = cd.id
      WHERE s.date_id = ?
      `,
      [slotId]
    );

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

/**
 * Annulation d’une réservation étudiante
 */
router.delete('/:id', authenticateToken, isStudent, async (req, res) => {
  const { id } = req.params;
  try {
    const [studentDetails] = await db.query(
      'SELECT id FROM students_details WHERE user_id = ?',
      [req.user.id]
    );
    if (studentDetails.length === 0) return res.status(404).json({ error: 'Student details not found' });
    const studentId = studentDetails[0].id;

    const [reservation] = await db.query(
      'SELECT status FROM speeddates WHERE date_id = ? AND student_id = ?',
      [id, studentId]
    );
    if (reservation.length === 0) {
      return res.status(404).json({ error: 'Reservation not found or you do not have permission to cancel it.' });
    }

    const currentStatus = reservation[0].status;

    if (currentStatus === 'cancelled_by_admin') {
      await db.query('DELETE FROM speeddates WHERE date_id = ?', [id]);
    } else if (currentStatus === 'booked') {
      await db.query(
        `
        UPDATE speeddates 
        SET student_id = NULL, status = 'available', gereserveerd_op = NULL, cancellation_reason = NULL
        WHERE date_id = ?
        `,
        [id]
      );
    } else {
      return res.status(400).json({ error: 'Invalid reservation state for cancellation.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error canceling reservation:', err);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

/**
 * Liste des entreprises pour l’écran étudiant
 */
router.get('/companies-details', authenticateToken, async (req, res) => {
  try {
    const [bedrijven] = await db.query(
      `
      SELECT 
        c.id  as company_id,
        u.id  as user_id,
        c.company_name,
        c.sector,
        c.about,
        CONCAT_WS(', ', NULLIF(c.street, ''), NULLIF(c.city, '')) as location
      FROM users u
      JOIN companies_details c ON u.id = c.user_id
      WHERE u.role = 'bedrijf'
      `
    );
    res.json(bedrijven);
  } catch (err) {
    console.error('Error fetching companies details for speeddates:', err);
    res.status(500).json({ error: 'Failed to fetch companies details' });
  }
});

/**
 * 1.1 — NOUVEL ENDPOINT : réserver par heure (clic immédiat)
 * URL finale: POST /api/reservations/by-time
 * body: { company_id: <companies_details.id>, begin_tijd: "HH:MM:SS" }
 */
router.post('/by-time', authenticateToken, isStudent, async (req, res) => {
  const { company_id, begin_tijd } = req.body; // ex: "13:25:00"
  if (!company_id || !begin_tijd) {
    return res.status(400).json({ error: 'company_id et begin_tijd requis' });
  }

  try {
    const [studentDetails] = await db.query(
      'SELECT id FROM students_details WHERE user_id = ?',
      [req.user.id]
    );
    if (studentDetails.length === 0) {
      return res.status(404).json({ error: 'Student details not found' });
    }
    const studentId = studentDetails[0].id;

    // empêcher plusieurs réservations chez la même entreprise (si souhaité)
    const [already] = await db.query(
      'SELECT 1 FROM speeddates WHERE company_id = ? AND student_id = ? AND status = "booked" LIMIT 1',
      [company_id, studentId]
    );
    if (already.length) {
      return res.status(409).json({ error: 'Je hebt al een reservatie met dit bedrijf.' });
    }

    // réserver si encore available
    const [result] = await db.query(
      `
      UPDATE speeddates
      SET student_id = ?, status = 'booked', gereserveerd_op = NOW()
      WHERE company_id = ? AND begin_tijd = ? AND status = 'available'
      `,
      [studentId, company_id, begin_tijd]
    );

    if (result.affectedRows === 1) {
      return res.json({ ok: true, msg: 'Créneau gereserveerd' });
    }
    return res.status(409).json({ error: 'This time slot is no longer available.' });
  } catch (err) {
    console.error('reserve by-time error', err);
    return res.status(500).json({ error: 'Failed to reserve' });
  }
});

module.exports = router;
