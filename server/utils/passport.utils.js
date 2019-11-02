const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const User = require('../models/user.model');
const config = require('../config/config');

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
  clientID: config.FACEBOOK_CLIENT_ID,
  clientSecret: config.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'first_name', 'last_name', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({
      $or: [
        { facebookId: profile.id },
        { email: profile.emails[0].value },
      ],
    });

    if (!user) {
      const newUser = new User({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        facebookId: profile.id,
        isVerified: true,
      });

      await newUser.save();
      return done(null, newUser);
    }

    Object.assign(user, { isVerified: true, facebookId: profile.id });
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({
      $or: [
        { googleId: profile.id },
        { email: profile.emails[0].value },
      ],
    });

    if (!user) {
      const newUser = new User({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        googleId: profile.id,
        isVerified: true,
      });

      await newUser.save();
      return done(null, newUser);
    }

    Object.assign(user, { isVerified: true, googleId: profile.id });
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new GithubStrategy({
  clientID: config.GITHUB_CLIENT_ID,
  clientSecret: config.GITHUB_CLIENT_SECRET,
  callbackURL: '/api/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({
      $or: [
        { githubId: profile.id },
        { email: profile._json.email },
      ],
    });

    if (!user) {
      const newUser = new User({
        email: profile._json.email,
        githubId: profile.id,
        isVerified: true,
      });

      await newUser.save();
      return done(null, newUser);
    }

    Object.assign(user, { isVerified: true, githubId: profile.id });
    await user.save();
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
