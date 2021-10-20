'use strict'

// 3rd party dependcies
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
// const morgan for logging
// once you copy in the basic-auth stuff get usermodel
const userModel = require('./auth/models/userModel.js')
// const basicAuth
const basicAuth = require('./auth/middleware/basic.js');
// const bearerAuth
const bearerAuth = require('./auth/middleware/bearer.js');
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/trees';

// my middleware


// initiate express
const app = express();

const sequelize = new Sequelize(DATABASE_URL);
const users = userModel(sequelize, DataTypes);

// require error handlers
const handle404 = require('./error-handlers/404.js');
const handle500 = require('./error-handlers/500.js');

// require authRouter
const authRouter = require('./auth/routes.js');

// use express.json
app.use(express.json());
// use morgan('dev')
// app.use(morgan('dev'));



// routes
app.post('/register', (req, res) => {
    Users.create(req.body)
    .then(user => {
        res.status(200).send(user);
    })
    .catch(e => {res.status(403).send('Error creating user')});
});

app.post('/signIn', basicAuth(users), (req, res) => {
    res.status(200).json(req.user);
});

app.get('/user', bearerAuth(users), (req, res) => {
    res.status(200).json(req.user);
});

// use authRouter
app.use(authRouter);

//use error handlers
app.use('*', handle404);
app.use(handle500);


// export server and start
module.exports = {
    server: app,
    start: port => {
        if (!port) { throw new Error('Missing your Port, Cap\'n'); }
        app.listen(port, () => console.log(`Listening on port ${port}`));
    },
};