const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authenticacteToken = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/login', (req,res) => {
    const { email, password} = req.body;
    const query = 'SELECT * FROM users WHEERE email = ?';
    db.query( query, [email], async (err, results) => {
        if (err){
            return res.status(500).json({ error: 'Database error'});
        }

        if ( results.length === 0){
            return res.status(401).json({ error: 'invalid email or password'});
        }

        const user = results [0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            return res.status(401).json({ error: 'invalide email or password'});
        }

        const token = jwt.sign({ id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({ token, user: { message: 'Login successful', token}});


    });
});

// Protected route
router.get('/protected', authenticateToken, (req, rest) => {
    res.json({message: 'This is a protected route', user: req.user});
});

module.exports = router;
module.exports = router;