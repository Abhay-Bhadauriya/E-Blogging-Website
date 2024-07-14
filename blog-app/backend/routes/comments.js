const express = require('express');
const router = express.Router();

// Get all comments for a specific post
router.get('/:postId', (req, res) => {
    const postId = req.params.postId;
    req.db.query('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC', [postId], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else {
            res.json(results);
        }
    });
});

// Create a new comment
router.post('/', (req, res) => {
    const { postId, content, author } = req.body;
    const newComment = { post_id: postId, content, author };
    req.db.query('INSERT INTO comments SET ?', newComment, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else {
            res.json({ id: results.insertId, ...newComment });
        }
    });
});

// Create a reply to a comment
router.post('/reply', (req, res) => {
    const { parentId, content, author } = req.body;
    const newReply = { parent_id: parentId, content, author };
    req.db.query('INSERT INTO comments SET ?', newReply, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else {
            res.json({ id: results.insertId, ...newReply });
        }
    });
});

module.exports = router;
