const express = require('express');
const passport = require('passport');
// const passport = require('../utils/passport.utils');
const validate = require('express-validation');
const authController = require('../controllers/auth.controller');
const paramValidation = require('../utils/param-validation.utils');

const router = express.Router();

router.route('/register')
  .post(validate(paramValidation.register), authController.register);

router.route('/login')
  // .post(validate(paramValidation.login), passport.authenticate('local', { session: false }), authController.login);
  .post(validate(paramValidation.login), authController.login);
// .post(validate(paramValidation.login), function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.send('woah'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.send('bam');
//     });
//   })(req, res, next);
// })

router.route('/verify-email/:token')
  .get(authController.verifyEmail);

router.route('/request-password-reset')
  .post(validate(paramValidation.requestPasswordReset), authController.requestPasswordReset);

router.route('/regain-password/:passwordResetId')
  .post(validate(paramValidation.regainPassword), authController.regainPassword);

// SOCIAL AUTH LOGINS
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook'), authController.socialLogin);
// router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
//   res.send('Authenticated with Facebook!');
// });
// authController.login
// router.route('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
//   res.send('Authenticated with Facebook!');
// });

// router.route('/facebook', passport.authenticate('facebook'));
// router.route('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
//   res.send('Authenticated with Facebook!')
// })

// router.route('/google', passport.authenticate('google'));
// router.route('/google/callback', passport.authenticate('google'), (req, res) => {
//   res.send('Authenticated with Google!');
// });

// router.route('/github', passport.authenticate('github'));
// router.route('/github/callback', passport.authenticate('github'), (req, res) => {
//   res.send('Authenticated with Github!');
// });


module.exports = router;
