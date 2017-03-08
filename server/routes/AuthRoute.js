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

/** POST /api/auth/phoneNumber - Returns a phone token if valid phone facebookAccKit is provided */
router.route('/phoneNumber')
    .post(authCtrl.execMobile);

/** GET /api/auth/profile - Returns user's profile if user logged in - This link is protected route*/
router.route('/profile')
    .get(expressJwt({ secret: config.jwtSecret }), authCtrl.viewProfile);

module.exports = router;