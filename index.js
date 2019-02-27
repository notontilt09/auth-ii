require('dotenv').config();
const express = require('express'); 
const helmet = require('helmet');   
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./data/users-module.js')

const secret = process.env.JWT_SECRET || 'secret for tokens'

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors({
    credentials: true,
    origin: true
}));

// global middleware for protecting routes
const protected = (req, res, next) => {
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

const generateToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username
    }

    const options = {
        expiresIn: '1d'
    }
    return jwt.sign(payload, secret, options)
}

server.get('/api/protected/users', protected, async (req, res) => {
    try {
       const users = await db.find()
       res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

server.post('/api/register', async (req, res) => {
    let user = req.body;
    if (!user.username || !user.password || !user.department) {
        res.status(404).json({ message: "username, password, and department required" });
    } else {
        // generate hash from users's pw
        const hash = bcrypt.hashSync(user.password, 8);
        user.password = hash;
    
        try {
            const newUser = await db.add(user);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ message: `Error adding user to the database.  Likely, a user by the name of ${req.body.username} already exists` });
        }
    }
});

server.post('/api/login', async (req, res) => {
    let { username, password } = req.body;

    try {
        const user = await db.findBy({ username }).first();

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            res
                .status(200)
                .json({ 
                    message: `Welcome ${user.username}!  Here's a token of my gratitude.`, 
                    token,
                    user,
                });
        } else {
            res.status(401).json({ message: 'You shall not pass!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error in retrieving user info' });
    }
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`\n *** Running on port ${port} **\n`);
})