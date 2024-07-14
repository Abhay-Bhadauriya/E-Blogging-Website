const express = require('express');
const router = express.Router();

// Like a post
router.post('/:postId', (req, res) => {
    const postId = req.params.postId;
    req.db.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else {
            res.json({ message: 'Post liked successfully' });
        }
    });
});

module.exports = router;
