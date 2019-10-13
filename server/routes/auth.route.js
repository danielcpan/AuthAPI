const express = require('express');
const validate = require('express-validation');
const authController = require('../controllers/auth.controller');
const paramValidation = require('../utils/paramValidation.utils');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/register')
  .post(validate(paramValidation.register), authController.register)

router.route('/login')
  .post(validate(paramValidation.login), authController.login)  

module.exports = router;
