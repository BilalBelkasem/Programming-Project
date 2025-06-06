const express = require('express');
const router = express.Router();
const mysql = require('mysql2');


router.get('/badge/:userId', async (req, res) => {
    const {userId} = req.params;
    try{
        const [user] = await db.query('SELECT * FROM users', [userId]);
        const [student] = await db.query('SELECT * FROM students_details', [userId]);

        if(!user.length || !student.length) return res.status(404).json({error: 'User not found'});

        res.json({user: user[0], student: student[0]});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

module.exports = router;