const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const APIError = require('../utils/APIError.utils');

module.exports = {
  register: async (req, res, next) => {
    const { username, firstName, lastName, email, password } = req.body; 

    if (!email) {
      const errMsg = 'Email is required to register'
      return next(new APIError(errMsg, httpStatus.UNAUTHORIZED, true));
    }

    if (!password) {
      const errMsg = 'Password is required to register'
      return next(new APIError(errMsg, httpStatus.UNAUTHORIZED, true));
    }

    try {
      let user = await User.findOne({ email: new RegExp(email, 'i')});

      if (user) {
        const errMsg = 'User already exists'
        return next(new APIError(errMsg, httpStatus.UNAUTHORIZED, true));
      }

      const newUser = new User({
        username,
        firstName,
        lastName,
        email,
        password: User.generateHash(password)
      })

      await newUser.save();
      const { password, ...userWithoutPass } = user;
      const token = jwt.sign(userWithoutPass.toJSON(), JWT_SECRET, { expiresIn: '365d' });

      return res.status(httpStatus.CREATED).json({
        user: newUser,
        token
      });
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
