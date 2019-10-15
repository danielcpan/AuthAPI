const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const APIError = require('../utils/APIError.utils');
const { sendRegistrationEmail } = require('../utils/node-mailer.utils');
const { JWT_SECRET } = require('../config/config');

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
      const token = jwt.sign(newUser.withoutPass(), JWT_SECRET, { expiresIn: '365d' });
      sendRegistrationEmail(req.body.email);

      return res.status(httpStatus.CREATED).json({
        user: newUser.withoutPass(),
        token
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

      const token = jwt.sign(user.withoutPass(), JWT_SECRET, { expiresIn: '365d' });

      return res.status(httpStatus.OK).json({ token });
    } catch (err) {
      return next(err);
    }
  }
};
