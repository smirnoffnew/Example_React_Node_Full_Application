const expressValidation = require('express-validation');
const APIError = require('../APIError');
const _ = require('lodash');
const httpStatus = require('http-status');

const convertJoiError2Message = err => err.errors.map(joiError => ({
  field: joiError.field.join('.'),
  message: joiError.messages.map(vem => vem.replace(/^".*" /, ''))
    .join('. ')
}));
const convertMongooseValidationError2Message = err => _.toPairs(err.errors)
  .map(pair => ({
    field: pair[0],
    message: pair[1].message
  }));

const convertMongooseError2Message = (err) => {
  if (err.message.startsWith('E11000 duplicate key error')) {
    return 'Duplicated field is not allowed';
  }
  return err.message;
};

const multerErrors = {
  LIMIT_PART_COUNT: 'Too many parts',
  LIMIT_FILE_SIZE: 'File too large',
  LIMIT_FILE_COUNT: 'Too many files',
  LIMIT_FIELD_KEY: 'Field name too long',
  LIMIT_FIELD_VALUE: 'Field value too long',
  LIMIT_FIELD_COUNT: 'Too many fields',
  LIMIT_UNEXPECTED_FILE: 'Unexpected field'
};
const normalizeError = (err) => {
  if (multerErrors[err.code]) {
    return new APIError(multerErrors[err.code], httpStatus.BAD_REQUEST, true);
  }
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = convertJoiError2Message(err);
    return new APIError(unifiedErrorMessage, err.status, true);
  }
  if (err.name === 'MongoError') {
    const unifiedErrorMessage = convertMongooseError2Message(err);
    return new APIError(unifiedErrorMessage, httpStatus.BAD_REQUEST, true);
  }
  if (err.name === 'ValidationError') {
    const unifiedErrorMessage = convertMongooseValidationError2Message(err);
    return new APIError(unifiedErrorMessage, httpStatus.BAD_REQUEST, true);
  }
  if (!(err instanceof APIError)) {
    return new APIError(err.message, err.status, err.isPublic);
  }
  return err;
};

module.exports = {
  convertJoiError2Message,
  normalizeError
};
