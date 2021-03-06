const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    min: 6,
    max: 255,
  },
  firstName: {
    type: String,
    max: 255,
  },
  lastName: {
    type: String,
    max: 255,
  },
  email: {
    type: String,
    unique: true,
    max: 255,
  },
  password: {
    type: String,
    min: 6,
    max: 255,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  facebookId: {
    type: String,
  },
  googleId: {
    type: String,
  },
  githubId: {
    type: String,
  },
}, {
  timestamps: true,
});

UserSchema.method({
  isValidPassword(password) {
    return bcrypt.compareSync(password, this.password);
  },
  withoutPass() {
    const { password, ...userWithoutPass } = this.toJSON();
    return userWithoutPass;
  },
});

UserSchema.static({
  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  },
  isValidHash({ original, hash }) {
    return bcrypt.compareSync(original, hash);
  },
});

module.exports = mongoose.model('User', UserSchema);
