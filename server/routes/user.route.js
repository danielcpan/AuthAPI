const express = require('express');
const expressJwt = require('express-jwt');
const validate = require('express-validation');
const userController = require('../controllers/user.controller');
const paramValidation = require('../utils/param-validation.utils');
const { JWT_SECRET } = require('../config/config');

const router = express.Router();

router.route('/me')
  .get(expressJwt({ secret: JWT_SECRET }), userController.me);

router.route('/search')
  .get(expressJwt({ secret: JWT_SECRET }), userController.search);

router.route('/:userId')
  .get(expressJwt({ secret: JWT_SECRET }), userController.get)
  .put(
    expressJwt({ secret: JWT_SECRET }),
    validate(paramValidation.updateUser), userController.update,
  );

module.exports = router;
