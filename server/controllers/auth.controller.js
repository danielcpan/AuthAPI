const httpStatus = require('http-status');

const User = require('../models/user.model');
const APIError = require('../utils/APIError.utils');

module.exports = {
  register: async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body; 
      const user = new User({
        firstName,
        lastName,
        email,
        password
      })

      await user.save();

      return res.status(httpStatus.CREATED).json(user);
    } catch (err) {
      return next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      return res.send('todo login');
    } catch (err) {
      return next(err);
    }
  }
};
