const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const config = require('../../config/env');
const Account = require('../models/Account.js');
const utils = require('../helpers/utils');

function listAllAccounts(req, res, next){
    //Option 1: store from database
    // Account.find({}, function(err, accounts){
    //    if(err) return res.json(err);
    //    return res.json({
    //        listAccount: accounts
    //    })
    // });

    //Option 2: use dummy list

    var accountList = [
        {
            "_id": "AAAAAAAAAAAAAAAAAAAAAA",
            "phone": "+841634067196",
            "email": "phuctd1803@gmail.com",
            "username": "phuctd1803",
            "password": "$2a$10$SYpm9jLJEY83z5qIJ8eWSuw1UqwN.A.0m6s9ZUG76q5tZIpBs9eym",
            "role": "parent",
            "__v": 0,
            "created_at": "2017-03-08T07:56:14.686Z",
            "e_verified": false
        },
        {
            "_id": "AAAAAAAAAAAAAAAAAAAAAB",
            "phone": "+841213182323",
            "email": "nathantran@gmail.com",
            "username": "nathantran",
            "password": "$2a$10$SYpm9jLJEY83z5qIJ8eWSuw1UqwN.A.0m6s9ZUG7asdqw1wijw1ee",
            "role": "parent",
            "__v": 0,
            "created_at": "2017-03-08T07:56:14.686Z",
            "e_verified": false
        }
    ];
    return res.json({accountList: accountList});

}

module.exports = {
    listAllAccounts: listAllAccounts
}