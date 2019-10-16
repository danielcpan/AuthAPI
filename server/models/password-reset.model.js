const mongoose = require('mongoose');

const PasswordResetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

PasswordResetSchema.method({
  isExpired() {
    const creationDate = new Date(this.createdAt);
    const currentDate = new Date();
    const timeDiff = Math.abs(creationDate.getTime() - currentDate.getTime());
    const diffHours = timeDiff / 3600000;

    // Currently set to always expire after 1 hour
    return diffHours > 1;
  },
});

module.exports = mongoose.model('PasswordReset', PasswordResetSchema);
