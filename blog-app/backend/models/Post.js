const db = require('../config/db');

const Post = {
    getAll: (callback) => {
        const sql = 'SELECT * FROM posts ORDER BY created_at DESC';
        db.query(sql, callback);
    },
    create: (data, callback) => {
        const sql = 'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)';
        db.query(sql, [data.title, data.content, data.author], callback);
    },
    getById: (id, callback) => {
        const sql = 'SELECT * FROM posts WHERE id = ?';
        db.query(sql, [id], callback);
    }
};

module.exports = Post;
