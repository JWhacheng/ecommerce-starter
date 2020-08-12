const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    privacy: Boolean,
    profile: {
      name: String,
      lastname: String,
      phone: String,
      gender: String,
      picture: String,
      birthdate: Date,
    },
    delivery: {
      address: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  },
  { timestamps: true }
);

// Password hash
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
