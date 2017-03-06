const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/env');
const Account = require('../models/Account.js');

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  Account.getByUsername(req.body.username)
    .then((account) => {
      if (account.validatePassword(req.body.password)) {
        const token = jwt.sign({ user: account }, config.jwtSecret);
        return res.json({
          token: token,
          user: account
        });
      } else {
        const err = new APIError('Password is not correct!', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }
    })
    .catch(e => next(e));
}
 
function register(req, res, next) {
  Account.getByUsername(req.body.username)
    .then((account) => {
      const err = new APIError('Username is already existed!', httpStatus.CONFLICT, true);
      return next(err);
    }, (err) => {
      var newAccount = new Account(req.body);
      newAccount.password = newAccount.generateHash(newAccount.password);
      newAccount.save()
        .then(savedAccount => {
          return res.json({
            token: token,
            user: savedAccount
          })
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
}

module.exports = {
    login: login,
    register: register
};
