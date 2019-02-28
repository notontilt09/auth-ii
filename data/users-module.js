const knex = require('knex')

const knexConfig = require('../knexfile.js')

const db = knex(knexConfig.development);

module.exports = {
    add,
    findByDepartment,
    findBy,
    findById,
    db
};

function findByDepartment(department) {
    return db('users')
        .select('id', 'username', 'password', 'department')
        .where(department)
}

function findBy(filter) {
    return db('users').where(filter); 
}

async function add(user) {
    const [id] = await db('users').insert(user);

    return findById(id);
}

function findById(id) {
    return db('users')
        .where({ id })
        .first();
}