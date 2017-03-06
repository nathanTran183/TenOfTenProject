const Joi = require('joi');

module.exports = {

  // POST /api/users
/*  createUser: {
    body: {
      username: Joi.string().required()
    }
  },*/

  // UPDATE /api/users/:userId
/*  updateUser: {
    body: {
      username: Joi.string().required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },*/

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().token().required(),
      password: Joi.string().min(6).required()
    }
  },

  // POST /api/auth/register
  register: {
    body: {
      username: Joi.string().token().required(),
      email: Joi.string().email(),
      password: Joi.string().min(6).required()
    }
  },
};
