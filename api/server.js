const express = require('express'); 
const configureMiddleware = require('./middleware.js');
const authRouter = require('../auth/authRouter.js');
const usersRouter = require('../users/usersRouter.js');

const server = express();

configureMiddleware(server);
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

module.exports = server;