const express = require('express');
const validate = require('express-validation');
const authController = require('../controllers/auth.controller');
const paramValidation = require('../utils/param-validation.utils');

const router = express.Router(); 

router.route('/register')
  .post(validate(paramValidation.register), authController.register)

router.route('/login')
  .post(validate(paramValidation.login), authController.login)

router.route('/verify-email/:token')
  .get(authController.verifyEmail)

// router.route('/regain-password')
//   .post(validate(paramValidation.regainPassword), userController.regainPassword);

// router.route('/request-password-reset')
//   .post(validate(paramValidation.requestPasswordReset),userController.requestPasswordReset);

module.exports = router;
