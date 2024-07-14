const express = require('express');
const router = express.Router();

// Get all posts
router.get('/', (req, res) => {
    req.db.query('SELECT * FROM posts', (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else {
            res.json(results);
        }
    });
});

// Get a specific post by ID
router.get('/:id', (req, res) => {
    const postId = req.params.id;
    req.db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Post not found' });
        } else {
            res.json(results[0]);
        }
    });
});

// Create a new post
router.post('/', (req, res) => {
    const { title, content, author } = req.body;
    const newPost = { title, content, author };
    req.db.query('INSERT INTO posts SET ?', newPost, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else {
            res.json({ id: results.insertId, ...newPost });
        }
    });
});

// Edit a specific post by ID
router.put('/:id', (req, res) => {
    const postId = req.params.id;
    const { title, content, author } = req.body;
    const updatedPost = { title, content, author };
    req.db.query('UPDATE posts SET ? WHERE id = ?', [updatedPost, postId], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else {
            res.json({ message: 'Post updated successfully', post: { id: postId, ...updatedPost } });
        }
    });
});

// Delete a specific post by ID
router.delete('/:id', (req, res) => {
    const postId = req.params.id;
    req.db.query('DELETE FROM posts WHERE id = ?', [postId], (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Database query error' });
        } else {
            res.json({ message: 'Post deleted successfully' });
        }
    });
});

module.exports = router;
