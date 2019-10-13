const Joi = require('@hapi/joi');

module.exports = {
  // POST /api/auth/register
  register: {
    body: {
      username: Joi.string().min(6).max(255),
      firstName: Joi.string().min(2).max(255),
      lastName: Joi.string().min(2).max(255),
      email: Joi.string().email().min(6).max(255).required(),
      password: Joi.string().required(),
    }
  },
  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },  
}
