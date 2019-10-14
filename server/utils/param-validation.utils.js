const Joi = require('joi');

module.exports = {
  // POST /api/auth/register
  registerSchema: {
    body: {
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(6).max(255).required(),
    }
  },
  // POST /api/auth/login
  loginSchema: {
    body: {
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(6).max(255).required()
    }
  },
  // POST /api/auth/register
  registerSchema: {
    body: {
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(6).max(255).required(),
    }
  },
  // POST /api/auth/login
  userUpdateSchema: {
    body: {
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(6).max(255).required()
    }
  },    
}
