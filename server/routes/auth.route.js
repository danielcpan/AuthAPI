const express = require('express');
const validate = require('express-validation');
const authController = require('../controllers/auth.controller');
const paramValidation = require('../utils/param-validation.utils');

const router = express.Router(); 

router.route('/register')
  .post(validate(paramValidation.register), authController.register)

router.route('/login')
  .post(validate(paramValidation.login), authController.login)

module.exports = router;
