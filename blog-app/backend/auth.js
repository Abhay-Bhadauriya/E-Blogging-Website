const jwt = require('jsonwebtoken');
const secret = 'mysecret'; // Change this to a secure key

function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '1h' });
}

module.exports = { generateToken };
