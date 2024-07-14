const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');
const categoriesRouter = require('./routes/categories');
const tagsRouter = require('./routes/tags');
const likesRouter = require('./routes/likes');
const fileUpload = require('express-fileupload');
const i18n = require('i18n');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Update with your MySQL root password
    database: 'blog_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

app.use((req, res, next) => {
    req.db = db;
    next();
});

// Multi-language support
i18n.configure({
    locales: ['en', 'es', 'fr'], // Add more languages as needed
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    cookie: 'lang',
});
app.use(i18n.init);

// Routes
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);
app.use('/likes', likesRouter);




// Default route
app.get('/', (req, res) => {
    res.send({ message: res.__('Welcome to the Blogging API') });
});


// Route to add a comment to a post
app.post('/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;
    const { author, content } = req.body;

    const comment = { post_id: postId, author, content };
    const sql = 'INSERT INTO comments SET ?';
    db.query(sql, comment, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json({ id: result.insertId, ...comment });
    });
});

// Route to get comments for a post
app.get('/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;

    const sql = 'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC';
    db.query(sql, [postId], (err, results) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json(results);
    });
});

app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM posts WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting post:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ id });
    });
});

// Port setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
