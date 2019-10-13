const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    min: 6,
    max: 255,
  },
  firstName: {
    type: String,
    min: 2,
    max: 255,
  },
  lastName: {
    type: String,
    min: 2,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
