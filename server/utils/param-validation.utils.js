const Joi = require('joi');

module.exports = {
  // POST /api/auth/register
  register: {
    body: {
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(6).max(255).required(),
    }
  },
  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(6).max(255).required()
    }
  },
  // POST /api/user/regain-password
  // regainPassword: {
  //   body: {
  //     resetUID: Joi.string().required(),
  //     newPassword: Joi.string().required(),
  //     secretKey: Joi.string().required()
  //   }
  // },
  // POST /api/user/password-reset
  // requestPasswordReset: {
  //   body: {
  //     email: Joi.string().email().required()
  //   }
  // },
  // POST /api/auth/login
  userUpdateSchema: {
    body: {
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(6).max(255).required()
    }
  },    
}
