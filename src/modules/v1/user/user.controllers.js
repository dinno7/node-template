const multer = require('multer');
const sharp = require('sharp');

const User = require('./user.model');
const { sendSuccessResponse, filterObj } = require('../../../utils/global');
const { factory, AppError, catchError } = require('../../../utils');
const { setUserIdInParams, createSendJWTToken } = require('./user.utils');


exports.getAllUsers = factory.getAll(User);
exports.getUserById = factory.getOneById(User);
exports.getMe = [setUserIdInParams, this.getUserById];