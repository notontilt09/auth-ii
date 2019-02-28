const router = require('express').Router();
const tokenService = require('./token-service.js');
const bcrypt = require('bcryptjs');
const db = require('../data/users-module.js')


router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
    let { username, password } = req.body;

    try {
        const user = await db.findBy({ username }).first();

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = tokenService.generateToken(user);
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

module.exports = router;