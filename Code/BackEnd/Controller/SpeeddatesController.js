// Get available timeslots for a company
app.get('/api/companies/:companyId/slots', async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const [slots] = await req.db.query(
      'SELECT * FROM timeslots WHERE company_id = ? AND available = 1',
      [companyId]
    );
    res.json(slots);
  } catch (err) {
    console.error('Error fetching timeslots:', err);
    res.status(500).json({ error: 'Server error fetching timeslots' });
  }
});

// Create a new reservation
app.post('/api/reservations', async (req, res) => {
  const { slotId, companyId } = req.body;
  const userId = req.user?.id; // Assuming you have user auth

  if (!slotId || !companyId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const conn = await req.db.getConnection();
  try {
    await conn.beginTransaction();

    // Check if slot is still available
    const [slot] = await conn.query(
      'SELECT * FROM timeslots WHERE id = ? AND available = 1',
      [slotId]
    );
    if (!slot.length) {
      return res.status(400).json({ error: 'Timeslot is no longer available' });
    }

    // Create reservation
    await conn.query(
      'INSERT INTO reservations (user_id, company_id, slot_id) VALUES (?, ?, ?)',
      [userId, companyId, slotId]
    );

    // Mark slot as unavailable
    await conn.query(
      'UPDATE timeslots SET available = 0 WHERE id = ?',
      [slotId]
    );

    await conn.commit();
    res.status(201).json({ message: 'Reservation created successfully' });
  } catch (err) {
    await conn.rollback();
    console.error('Error creating reservation:', err);
    res.status(500).json({ error: 'Server error creating reservation' });
  } finally {
    conn.release();
  }
});