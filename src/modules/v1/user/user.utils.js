const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { hashToken, sendSuccessResponse } = require('../../../utils/global');

// >> Utils:
exports.generateJWTToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_64, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.createSendJWTToken = function (res, user, statusCode = 200) {
  const jwtToken = exports.generateJWTToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', jwtToken, cookieOptions);

  user.password = undefined;

  return sendSuccessResponse(res, { user }, 1, statusCode, { token: jwtToken });
};

exports.setUserIdInParams = async function (req, res, next) {
  req.params.id = res.locals.user._id;
  next();
};

// >> Mongodb middlewares:
exports.preSave_convertUserPasswordToHash = async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
};

exports.preSave_setPasswordUpdatedAt = function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordUpdatedAt = Date.now() - 1000;
  next();
};

// >> Schema Methods & Statics functions:
exports.getUserByResetPasswordToken = async function (token) {
  const resetTokenHash = hashToken(token);

  const user = await this.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: { $gt: Date.now() },
  }).select('+password');

  return user;
};

exports.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = hashToken(resetToken);
  this.passwordResetExpires = Date.now() + 1000 * 60 * 10;

  return resetToken;
};

exports.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordUpdatedAt) {
    const passwordUpdatedAtTimestamp = parseInt(
      this.passwordUpdatedAt.getTime() / 1000,
      10,
    );

    return passwordUpdatedAtTimestamp > JWTTimeStamp;
  }

  return false;
};

exports.isPasswordCorrect = async function (userPassword, hashedPassword) {
  return await bcrypt.compare(userPassword, hashedPassword);
};
