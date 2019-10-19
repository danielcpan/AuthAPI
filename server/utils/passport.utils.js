const passport = require('passport');
const User = require('../models/user.model');
// const JwtStrategy = require('passport-jwt').Strategy;
// const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy
// const GooglePlusTokenStrategy = require('passport-google-plus-token');
// const FacebookTokenStrategy = require('passport-facebook-token');
// const config = require('./configuration');
// const User = require('./models/user');

// const cookieExtractor = req => {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies['access_token'];
//   }
//   return token;
// }

// JSON WEB TOKENS STRATEGY
// passport.use(new JwtStrategy({
//   jwtFromRequest: cookieExtractor,
//   secretOrKey: config.JWT_SECRET,
//   passReqToCallback: true
// }, async (req, payload, done) => {
//   try {
//     // Find the user specified in token
//     const user = await User.findById(payload.sub);

//     // If user doesn't exists, handle it
//     if (!user) {
//       return done(null, false);
//     }

//     // Otherwise, return the user
//     req.user = user;
//     done(null, user);
//   } catch(error) {
//     done(error, false);
//   }
// }));

// Google OAuth Strategy
// passport.use('googleToken', new GooglePlusTokenStrategy({
//   clientID: config.oauth.google.clientID,
//   clientSecret: config.oauth.google.clientSecret,
//   passReqToCallback: true,
// }, async (req, accessToken, refreshToken, profile, done) => {
//   try {
//     // Could get accessed in two ways:
//     // 1) When registering for the first time
//     // 2) When linking account to the existing one

//     // Should have full user profile over here
//     console.log('profile', profile);
//     console.log('accessToken', accessToken);
//     console.log('refreshToken', refreshToken);

//     if (req.user) {
//       // We're already logged in, time for linking account!
//       // Add Google's data to an existing account
//       req.user.methods.push('google')
//       req.user.google = {
//         id: profile.id,
//         email: profile.emails[0].value
//       }
//       await req.user.save()
//       return done(null, req.user);
//     } else {
//       // We're in the account creation process
//       let existingUser = await User.findOne({ "google.id": profile.id });
//       if (existingUser) {
//         return done(null, existingUser);
//       }

//       // Check if we have someone with the same email
//       existingUser = await User.findOne({ "local.email": profile.emails[0].value })
//       if (existingUser) {
//         // We want to merge google's data with local auth
//         existingUser.methods.push('google')
//         existingUser.google = {
//           id: profile.id,
//           email: profile.emails[0].value
//         }
//         await existingUser.save()
//         return done(null, existingUser);
//       }

//       const newUser = new User({
//         methods: ['google'],
//         google: {
//           id: profile.id,
//           email: profile.emails[0].value
//         }
//       });
  
//       await newUser.save();
//       done(null, newUser);
//     }
//   } catch(error) {
//     done(error, false, error.message);
//   }
// }));

// passport.use('facebookToken', new FacebookTokenStrategy({
//   clientID: config.oauth.facebook.clientID,
//   clientSecret: config.oauth.facebook.clientSecret,
//   passReqToCallback: true
// }, async (req, accessToken, refreshToken, profile, done) => {
//   try {
//     console.log('profile', profile);
//     console.log('accessToken', accessToken);
//     console.log('refreshToken', refreshToken);
    
//     if (req.user) {
//       // We're already logged in, time for linking account!
//       // Add Facebook's data to an existing account
//       req.user.methods.push('facebook')
//       req.user.facebook = {
//         id: profile.id,
//         email: profile.emails[0].value
//       }
//       await req.user.save();
//       return done(null, req.user);
//     } else {
//       // We're in the account creation process
//       let existingUser = await User.findOne({ "facebook.id": profile.id });
//       if (existingUser) {
//         return done(null, existingUser);
//       }

//       // Check if we have someone with the same email
//       existingUser = await User.findOne({ "local.email": profile.emails[0].value })
//       if (existingUser) {
//         // We want to merge facebook's data with local auth
//         existingUser.methods.push('facebook')
//         existingUser.facebook = {
//           id: profile.id,
//           email: profile.emails[0].value
//         }
//         await existingUser.save()
//         return done(null, existingUser);
//       }

//       const newUser = new User({
//         methods: ['facebook'],
//         facebook: {
//           id: profile.id,
//           email: profile.emails[0].value
//         }
//       });

//       await newUser.save();
//       done(null, newUser);
//     }
//   } catch(error) {
//     done(error, false, error.message);
//   }
// }));

// LOCAL STRATEGY
passport.serializeUser(function(user, done) {
  console.log('in serialize')
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('in deserialize')
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email'
  }, 
  async (email, password, done) => {
    try {
      console.log('we are inside passport')
      console.log('email:', email)
      console.log('password:', password)
      const user = await User.findOne({ email: new RegExp(email, 'i') });
      
      if (!user) return done(null, false);
  
      if (!user.isValidPassword(password)) return done(null, false)
    
      done(null, user);
    } catch(error) {
      console.log('woot')
      done(error, false);
    }
  }
));

module.exports = passport;
