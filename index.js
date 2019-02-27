const express = require('express'); 
const helmet = require('helmet');   
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session);
const dotenv = require('dotenv').config();

const db = require('./data/users-module.js')

const server = express();

const sessionConfig = {
    name: 'session',
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 3, // in ms
        secure: false, // if true, only use over https (in production)
    },
    httpOnly: true, // user can't access cookie from js
    resave: false, // if true, resave cookie on every request
    saveUninitialized: false, // for law abiding and not setting cookies automatically

    store: new KnexSessionStore({
        knex: db.db,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60 // in ms
    })
}
server.use(helmet());
server.use(express.json());
server.use(cors({
    credentials: true,
    origin: true
}));
server.use(session(sessionConfig));

// global middleware for protecting routes
const protected = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Invalid Credentials' });
    }
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
    if (!user.username || !user.password) {
        res.status(404).json({ message: "username and password required" });
    } else {
        // generate hash from users's pw
        const hash = bcrypt.hashSync(user.password, 8);
        user.password = hash;
    
        try {
            const newUser = await db.add(user);
            req.session.user = newUser;
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
            req.session.user = user;
            res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
            res.status(401).json({ message: 'You shall not pass!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error in retrieving user info' });
    }
});

server.get('/api/protected/logout', protected, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.send('Error Logging Out');
        } else {
            res.send('Goodbye!')
        }
    })
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`\n *** Running on port ${port} **\n`);
})