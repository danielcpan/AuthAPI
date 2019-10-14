const express = require('express');
const validate = require('express-validation');
const authController = require('../controllers/auth.controller');
const { registerSchema, loginSchema } = require('../utils/paramValidation.utils');
const router = express.Router(); // eslint-disable-line new-cap

router.route('/register')
  .post(validate(registerSchema), authController.register)
  // .post(authController.register)

router.route('/login')
  .post(validate(loginSchema), authController.login)
  // .post(authController.login)  

module.exports = router;
