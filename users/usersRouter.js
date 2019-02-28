const router = require('express').Router();
const protected = require('../auth/protectedMiddleware.js');
const db = require('../data/users-module.js')

router.get('/', protected, async (req, res) => {
    const department = req.decodedJwt.department
    try {
        const users = await db.findByDepartment( {department} );
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;