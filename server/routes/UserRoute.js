const express = require('express');
const expressJwt = require('express-jwt');
const userCtrl = require('../controllers/UserController.js');
const config = require('../../config/env');
const router = express.Router();
const utils = require('../helpers/utils');

/** GET /api/user/index - Returns all accounts of system if user logged in and user's role is admin  - This link is protected route*/
router.route('/index')
    .get(expressJwt({ secret: config.jwtSecret }),utils.isAdmin, userCtrl.listAllAccounts);

module.exports = router;