const Joi = require('joi');

module.exports = {

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().token().min(5).required(),
      password: Joi.string().min(6).required()
    }
  },

  // POST /api/auth/register
  register: {
    body: {
      username: Joi.string().token().min(5).required(),
      email: Joi.string().email(),
      password: Joi.string().min(6).required()
    }
  },
};
