const validator = require('validator');
const APIError = require('../APIError');
const httpStatus = require('http-status');
const Business = require('../../modules/business/business.model');
const validationRules = require('../../validation-rules');
const isPng = require('is-png');
const isJpg = require('is-jpg');
const _ = require('lodash');
const Firebase = require('../../services/firebase')
  .getClient();

/**
 * Checks, is received parameter id is valid mongoose parameter
 * @param {Function} callback function to call after validation
 * @return {Function} express's middleware
 */
exports.validateId = callback => (req, res, next, id) => {
  if (!validator.isMongoId(id)) {
    return next(
      new APIError(`Parameter ${id} is not a valid object id`, httpStatus.BAD_REQUEST, true)
    );
  }
  return callback(req, res, next, id);
};

/**
 * Checks, is received email is unique
 * @param {Mongoose.Model} model model of entity to search
 * @return {Function} express's middleware
 */
exports.isUniqueEmail = model => (req, res, next) => {
  model
    .find({ email: req.body.email })
    .countDocuments()
    .exec()
    .then((count) => {
      if (count === 0) {
        return next();
      }
      return next(new APIError('This email is already in use', httpStatus.BAD_REQUEST, true));
    });
};

/**
 * Checks, is file, attached to request is image
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next object
 * @property {Promise<string>} req.file - received file
 */
exports.isImageSingleFile = (req, res, next) => {
  const { file } = req;
  if (!file) {
    return next(new APIError('No one file provided', httpStatus.BAD_REQUEST, true));
  }
  if (
    validationRules.files.image.mimetypes.indexOf(file.mimetype) < 0
    || (!isPng(file.buffer) && !isJpg(file.buffer))
  ) {
    return next(new APIError('Received file is not an image', httpStatus.BAD_REQUEST, true));
  }
  return next();
};

/**
 * Checks, is size of file, attached to request is less than maximum allowed size of image
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next object
 * @property {Promise<string>} req.file - received file
 */
exports.isAllowedImageSize = (req, res, next) => {
  const { file } = req;
  if (file.buffer.length > validationRules.files.image.maxSize) {
    return next(
      new APIError(
        `Received to large file: ${file.data.length}bytes, while max size is ${validationRules.files.image}bytes`,
        httpStatus.BAD_REQUEST,
        true
      )
    );
  }
  return next();
};

/**
 * Checks, is value, provided in body is unique
 * @param {string} field list of fields to check
 * @param {Mongoose.Model} model model of entity to search
 * @return {Function} express's middleware
 */
exports.isUnique = (field, model) => (req, res, next) => {
  model
    .find({ [field]: _.get(req.body, field) })
    .countDocuments()
    .exec()
    .then((count) => {
      if (count === 0) {
        return next();
      }
      return next(new APIError(`This ${field} is already exits`, httpStatus.BAD_REQUEST, true));
    });
};


const checkIsUrlPointsToFileAtRemoteStorage = async (url) => {
  if (url && !await Firebase.storage.isUrlLinksToExistingFile(url)) {
    throw new Error('Image not found');
  }
  return true;
};
/**
 * Checks, is value, provided in body is link to existing image
 * @param {string} field in body, where image url is binded
 * @return {Function} express's middleware
 */
exports.isImageExistAtRemoteStorage = field => async (req, res, next) => {
  const imageUrl = _.get(req.body, field);
  try {
    if (_.isArray(imageUrl)) {
      await Promise.all(imageUrl.map(checkIsUrlPointsToFileAtRemoteStorage));
      return next();
    }
    if (_.isString(imageUrl)) {
      await checkIsUrlPointsToFileAtRemoteStorage(imageUrl);
      return next();
    }
    return next();
  } catch (err) {
    return next(new APIError(`Unable to find image: ${field}`, httpStatus.BAD_REQUEST, true));
  }
};

exports.isUserCanCreateNewBusiness = async (req, res, next) => {
  try {
    const countOfCreatedBusinessByUser = await Business.countByUser(req.authUser);
    if (countOfCreatedBusinessByUser >= validationRules.business.maxCountOfBusinessPerUser) {
      return next(new APIError(`You have already created ${countOfCreatedBusinessByUser} businesses and cannot create a new one`, httpStatus.BAD_REQUEST, true));
    }
    return next();
  } catch (err) {
    return next(err);
  }
};
