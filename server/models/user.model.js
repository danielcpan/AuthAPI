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
    required: true,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  isVerified: {
    type: Boolean,
    default: false
  },  
  isAdmin: {
    type: Boolean,
    default: false,    
  }
}, {
  timestamps: true,
});

UserSchema.method({
  validPassword: function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
});

UserSchema.static({
  generateHash: function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  isValidHash: function validPassword({ original, hash }) {
    return bcrypt.compareSync(original, hash);
  },
});

module.exports = mongoose.model('User', UserSchema);
