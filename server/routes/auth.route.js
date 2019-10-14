const express = require('express');
const validate = require('express-validation');
const authController = require('../controllers/auth.controller');
const { registerSchema, loginSchema } = require('../utils/param-validation.utils');
const router = express.Router(); 

router.route('/register')
  .post(validate(registerSchema), authController.register)

router.route('/login')
  .post(validate(loginSchema), authController.login)

module.exports = router;
