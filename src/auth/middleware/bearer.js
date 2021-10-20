'use strict';

module.exports = (users) => (req, res, next) => {
    // req.headers.authorization

if (!req.headers.authorization) { next('Invalid Login'); return users; }

let token = req.headers.authorization.split(' ').pop();

users.authenticateToken(token)
  .then(validUser => {
    req.user = validUser;
    next();
  })
  .catch (err => next('Invalid Login'));
}
