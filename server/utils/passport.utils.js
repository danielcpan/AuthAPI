const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');
const { FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } = require('../config/config');

// passport.use(new GitHubStrategy({
//     clientID: GITHUB_CLIENT_ID,
//     clientSecret: GITHUB_CLIENT_SECRET,
//     callbackURL: "http://127.0.0.1:3000/auth/github/callback"
//   }, (accessToken, refreshToken, profile, done) => {
//     User.findOrCreate({ githubId: profile.id }, (err, user) => {
//       return done(err, user);
//     });
//   }
// ));

// LOCAL STRATEGY
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// FACEBOOK STRATEGY
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_CLIENT_ID,
  clientSecret: FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
  profileFields: ['id', 'first_name', 'last_name', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
  const { _json: fbUser } = profile;
  console.log('accessToken');
  console.log(accessToken);
  console.log('fbUser');
  console.log(fbUser);

  try {
    const user = await User.findOne({ $or: [{ facebookId: fbUser.id }, { email: fbUser.email }] });
    if (!user) {
      const newUser = new User({
        firstName: fbUser.firstName,
        lastName: fbUser.lastName,
        email: fbUser.email,
        facebookId: fbUser.id,
        isVerified: true,
      });

      await newUser.save();
      return done(null, newUser);
    }

    Object.assign(user, { isVerified: true, facebookId: fbUser.id });
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
