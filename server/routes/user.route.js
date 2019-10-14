const express = require('express');
const validate = require('express-validation');
const userController = require('../controllers/user.controller');
const { registerSchema, loginSchema } = require('../utils/paramValidation.utils');
const router = express.Router(); 

router.route('/')
  .get(validate(registerSchema), userController.list)
  .post(validate(registerSchema), userController.create)

router.route('/:userId')
  .get(validate(registerSchema), userController.get)
  .post(validate(registerSchema), userController.update)

module.exports = router;