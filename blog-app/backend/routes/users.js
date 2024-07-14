const express = require('express');
const router = express.Router();
const { generateToken } = require('../auth');

// User login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    req.db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database query error' });
        } else if (results.length === 0) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        } else {
            const user = results[0];
            const token = generateToken(user);
            res.json({ success: true, token });
        }
    });
});

module.exports = router;
