const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'secret for tokens'

const generateToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department
    }

    const options = {
        expiresIn: '1d'
    }
    return jwt.sign(payload, secret, options)
}

module.exports = {
    generateToken
}
