const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret for tokens'

// global middleware for protecting routes
module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                // token was tampered with
                res.status(401).json({ message: 'You been messing with that token???' });
            } else {
                req.decodedJwt = decodedToken;
                next();
            }
        })
    } else {
        res.status(401).json({ message: 'You shall not pass' });
    }
}
