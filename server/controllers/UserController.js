const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/env');
const Account = require('../models/Account.js');
const utils = require('../helpers/utils');

function listAllAccounts(req, res, next){
    Account.find({}, function(err, accounts){
       if(err) return res.json(err);
       return res.json({
           listAccount: accounts
       })
    });
}

module.exports = {
    listAllAccounts: listAllAccounts
}