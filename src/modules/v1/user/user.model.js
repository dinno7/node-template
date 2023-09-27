const mongoose = require('mongoose');

const {
  getUserByResetPasswordToken,
  generatePasswordResetToken,
  changedPasswordAfter,
  isPasswordCorrect,
  preSave_convertUserPasswordToHash,
  preSave_setPasswordUpdatedAt,
} = require('./user.utils');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'The user name is required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'The email of user is required'],
      lowercase: true,
      validate: {
        validator: function (VAL) {
          const emailPattern = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
          return emailPattern.test(VAL);
        },
        message: 'Email is invalid, provide a valid Email',
      },
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'lead-guide', 'guide'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Provide a Password'],
      minlength: [8, 'The min length for Password is 8 characters'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Provide a Confirm password'],
      minLength: [8, 'The min length for Confirm password is 8 characters'],
      validate: {
        validator: function (VAL) {
          return VAL === this.password;
        },
        message: 'Password and Confirm password must be same value',
      },
    },
    passwordUpdatedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', preSave_convertUserPasswordToHash);
userSchema.pre('save', preSave_setPasswordUpdatedAt);

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.isPasswordCorrect = isPasswordCorrect;
userSchema.methods.changedPasswordAfter = changedPasswordAfter;
userSchema.methods.generatePasswordResetToken = generatePasswordResetToken;

userSchema.statics.getUserByResetPasswordToken = getUserByResetPasswordToken;

const User = mongoose.model('User', userSchema);

module.exports = User;
