const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const APIError = require('../utils/APIError.utils');
const { sendRegistrationEmail } = require('../utils/node-mailer.utils');
const { JWT_SECRET, EMAIL_SECRET } = require('../config/config');

module.exports = {
  register: async (req, res, next) => {
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
      const authToken = jwt.sign(newUser.withoutPass(), JWT_SECRET, { expiresIn: '365d' });
      const emailToken = jwt.sign(newUser.withoutPass(), EMAIL_SECRET, { expiresIn: '1h'})
      sendRegistrationEmail(req.body.email, emailToken);

      return res.status(httpStatus.CREATED).json({
        user: newUser.withoutPass(),
        authToken
      });
    } catch (err) {
      return next(err);
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

      const authToken = jwt.sign(user.withoutPass(), JWT_SECRET, { expiresIn: '365d' });

      return res.status(httpStatus.OK).json({ authToken });
    } catch (err) {
      return next(err);
    }
  },
  verifyEmail: async (req, res, next) => {
    try {
      const { _id } = jwt.verify(req.params.token, EMAIL_SECRET); 
      const user = await User.findOne({ _id })

      if (!user) {
        return next(new APIError('User not found', httpStatus.NOT_FOUND));
      }

      user.isVerified = true;
      await user.save();

      return res.send('Email Verified!')
    } catch (err) {
      return next(err);
    }
  },
  requestPasswordReset: async (req, res, next) => {
    try {
      return res.status(httpStatus.OK).json(req.user)
    } catch (err) {
      return next(err);
    }
  },
  regainPassword: async (req, res, next) => {
    try {
      return res.status(httpStatus.OK).json(req.user)
    } catch (err) {
      return next(err);
    }
  },  
};
