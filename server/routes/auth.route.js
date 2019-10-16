const express = require('express');
const validate = require('express-validation');
const authController = require('../controllers/auth.controller');
const paramValidation = require('../utils/param-validation.utils');

const router = express.Router();

router.route('/register')
  .post(validate(paramValidation.register), authController.register);

router.route('/login')
  .post(validate(paramValidation.login), authController.login);

router.route('/verify-email/:token')
  .get(authController.verifyEmail);

router.route('/request-password-reset')
  .post(validate(paramValidation.requestPasswordReset), authController.requestPasswordReset);

router.route('/regain-password/:passwordResetId')
  .post(validate(paramValidation.regainPassword), authController.regainPassword);

module.exports = router;
