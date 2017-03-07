const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/env');
const Account = require('../models/Account.js');
const fbAccKit = require('../helpers/fbacckit');
const utils = require('../helpers/utils');
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
                const token = jwt.sign({user: account}, config.jwtSecret);
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
    //decode phone_token
    var phone = jwt.verify(req.body.phone_token, config.jwtSecret);
    var newAccount = new Account(req.body);
    newAccount.id = utils.getUUID();
    newAccount.phone = phone.result.phone;

    newAccount.save()
        .then(savedAccount => {
            const token = jwt.sign({user: savedAccount}, config.jwtSecret);
            return res.json({
                token: token,
                user: savedAccount
            })
        }, error => {
            console.log();
            return next(error);
        })
        .catch(e => {
            res.json(e);
        });

}

function execMobile(req, res, next) {
    fbAccKit.phoneForCode(req.body.code, function (err, result) {
        if (err) {
            return err;
        }
        const phoneToken = jwt.sign({result}, config.jwtSecret);
        console.log(phoneToken);
        return res.json({
            phone_token: phoneToken
        });
    });
}

module.exports = {
    login: login,
    register: register,
    execMobile: execMobile
};
