const express = require('express');
const expressJwt = require('express-jwt');
const validate = require('express-validation');
const userController = require('../controllers/user.controller');
const paramValidation = require('../utils/param-validation.utils');
const config = require('../config/config');

const router = express.Router();

router.route('/me')
  .get(expressJwt({ secret: config.JWT_SECRET }), userController.me);

router.route('/search')
  .get(expressJwt({ secret: config.JWT_SECRET }), userController.search);

router.route('/:userId')
  .get(expressJwt({ secret: config.JWT_SECRET }), userController.get)
  // .get(userController.get)
  .put(
    expressJwt({ secret: config.JWT_SECRET }),
    validate(paramValidation.updateUser), userController.update,
  );

module.exports = router;
