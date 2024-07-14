const express = require('express');
const router = express.Router();

// Get all tags
router.get('/', (req, res) => {
    req.db.query('SELECT * FROM tags ORDER BY name', (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else {
            res.json(results);
        }
    });
});

// Create a new tag
router.post('/', (req, res) => {
    const { name } = req.body;
    req.db.query('INSERT INTO tags SET ?', { name }, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else {
            res.json({ id: results.insertId, name });
        }
    });
});

module.exports = router;
