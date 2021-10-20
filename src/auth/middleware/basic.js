'use strict';

// 3rd party dependencies
const base64 = require('base-64');

module.exports = (users) => (req, res, next) => {
    // req.headers.auth -> decode

if (!req.headers.authorization) { next('Invalid Login'); return }

let basic = req.headers.authorization.split(' ').pop();
let [user, pass] = base64.decode(basic).split(':');

users.authenticateBasic(user, pass)
  .then(validUser => {
    req.user = validUser;
    next();
  })
  .catch (err => next('Invalid Login'));
}
