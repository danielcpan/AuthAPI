const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const APIError = require('../utils/APIError.utils');
const { JWT_SECRET } = require('../config/config');

module.exports = {
register: async (req, res, next) => {
    // Joi removes the necessity of these
    // if (!req.body.email) {
    //   const errMsg = 'Email is required to register'
    //   return next(new APIError(errMsg, httpStatus.UNAUTHORIZED, true));
    // }

    // if (!req.body.password) {
    //   const errMsg = 'Password is required to register'
    //   return next(new APIError(errMsg, httpStatus.UNAUTHORIZED, true));
    // }

    try {
      const user = await User.findOne({ email: new RegExp(req.body.email, 'i')});

      if (user) {
        const errMsg = 'User already exists'
        return next(new APIError(errMsg, httpStatus.UNAUTHORIZED, true));
      }

      const newUser = new User({
        ...req.body,
        password: User.generateHash(req.body.password)
      })

      await newUser.save();
      const { password, ...withoutPass } = newUser.toJSON();
      const token = jwt.sign(withoutPass, JWT_SECRET, { expiresIn: '365d' });

      return res.status(httpStatus.CREATED).json({
        user: withoutPass,
        token
      });
    } catch (err) {
      // Explicity specify this as an auth error
      return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
    }
  },
  login: async (req, res, next) => {   
    try {
      const user = await User.findOne({ email: new RegExp(req.body.email, 'i')});

      if (!user) {
        return next(new APIError('User not found', httpStatus.NOT_FOUND));
      }

      if (!user.validPassword(req.body.password)) {
        return next(new APIError('Password is incorrect', httpStatus.UNAUTHORIZED));
      }
      
      const { password, ...withoutPass } = user.toJSON();
      const token = jwt.sign(withoutPass, JWT_SECRET, { expiresIn: '365d' });

      return res.status(httpStatus.OK).json({ token });
    } catch (err) {
      // Explicity specify this as an auth error
      return next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true));
    }
  }
};
