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
    Account.getByUsername(req.body.username)
        .then((account) => {
            utils.checkPassword(req.body.password, account.password, function (err, result) {
                if (err) return res.json(err);
                if (result == true) {
                    const token = jwt.sign({
                        userId: account._id,
                        role: account.role,
                        expiresIn: config.expireTime
                    }, config.jwtSecret);
                    return res.json({
                        profile: {
                            id: account._id,
                            username: account.username,
                            email: account.email,
                            e_verified: account.e_verified,
                            phone: account.phone,
                            role: account.role
                        },
                        id_token: token
                    });
                } else {
                    var err = new APIError('Password is not correct!', httpStatus.UNAUTHORIZED, true);
                    return next(err.message);
                }
            })
        },error =>{
            return next(error);
        })
        .catch(e => {
            return res.json(e);
        } );
}

function register(req, res, next) {
    //decode phone_token
    jwt.verify(req.body.phone_token, config.jwtSecret, function (err, phoneDecoded) {
        if (err) return res.json(err);
        var phone = phoneDecoded;
        // handle saving account
        var newAccount = new Account(req.body);
        newAccount.phone = phone.result.phone;
        newAccount.save()
            .then(savedAccount => {
                const token = jwt.sign({
                    userId: savedAccount._id,
                    role: savedAccount.role,
                    expiresIn: config.expireTime
                }, config.jwtSecret);
                return res.json({
                    profile: {
                        id: savedAccount._id,
                        username: savedAccount.username,
                        email: savedAccount.email,
                        e_verified: savedAccount.e_verified,
                        phone: savedAccount.phone,
                        role: savedAccount.role
                    },
                    id_token: token
                })
            }, error => {
                utils.getStringErrors(error.errors, function (err, message) {
                    if (err) {
                        return res.json(err);
                    }
                    var errMessage = new APIError(message, httpStatus.CONFLICT, true);
                    return res.json(errMessage.message);
                });
            })
            .catch(e => {
                return res.json(e)
            });
    });
}

function execMobile(req, res, next) {
    fbAccKit.phoneForCode(req.body.code, function (err, result) {
        if (err) {
            return err;
        }
        const phoneToken = jwt.sign({result}, config.jwtSecret);
        return res.json({
            phone_token: phoneToken
        });
    });
}

function viewProfile(req, res, next) {
    var user = req.user;
    Account.getById(user.userId)
        .then((account) => {
            return res.json({
                profile: {
                    id: account._id,
                    username: account.username,
                    email: account.email,
                    e_verified: account.e_verified,
                    phone: account.phone,
                    role: account.role
                }
            })
        }, error => {
            return res.json(error);
        })
        .catch(e => res.json(e));
}

module.exports = {
    login: login,
    register: register,
    execMobile: execMobile,
    viewProfile: viewProfile
};
