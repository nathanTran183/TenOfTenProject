const express = require('express');
const validate = require('express-validation');
const expressJwt = require('express-jwt');
const paramValidation = require('../../config/param-validation');
const authCtrl = require('../controllers/AuthController.js');
const config = require('../../config/env');
const router = express.Router();

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
    .post(validate(paramValidation.login), authCtrl.login);

/** POST /api/auth/register - Returns userdata and token if valid information is provided */
router.route('/register')
    .post(validate(paramValidation.register), authCtrl.register);

/** POST /api/auth/addAccount - Returns userdata and token if valid information is provided and valid token */
router.route('/addAccount')
    .post(validate(paramValidation.register),expressJwt({ secret: config.jwtSecret }), authCtrl.register);
//decode phone number
router.route('/phoneNumber')
    .post(authCtrl.execMobile);

module.exports = router;