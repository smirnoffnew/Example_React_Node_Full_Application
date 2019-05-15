const ACE = require('../../../config/index').rolesConfig;
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');

function checkAccessToUser(action) {
  return async (req, res, next) => {
    if (
      req.authUser
      && (await ACE.checkAccess(req.authUser.role, action, {
        authUser: req.authUser
      }))
    ) {
      return next();
    }
    return next(new APIError(null, httpStatus.FORBIDDEN, false));
  };
}

const uploadImage = checkAccessToUser('storage:uploadImage');
const deleteImage = checkAccessToUser('storage:deleteImage');
const listFiles = checkAccessToUser('storage:list:files');

module.exports = {
  uploadImage,
  listFiles,
  deleteImage
};
