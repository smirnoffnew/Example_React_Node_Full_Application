const ACE = require('../../../config/index').rolesConfig;
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');

function checkAccessToUser(action) {
  return async (req, res, next) => {
    if (
      req.authUser
      && (await ACE.checkAccess(req.authUser.role, action, {
        businessUser: req.$businessUser,
        authUser: req.authUser
      }))
    ) {
      return next();
    }
    return next(new APIError(null, httpStatus.FORBIDDEN, false));
  };
}

const update = checkAccessToUser('businessUser:update');
const updatePassword = checkAccessToUser('businessUser:update:password');
const updateEmail = checkAccessToUser('businessUser:update:email');
const _delete = checkAccessToUser('businessUser:delete');
const get = checkAccessToUser('businessUser:get');
const list = checkAccessToUser('businessUser:list');

module.exports = {
  update,
  updatePassword,
  updateEmail,
  delete: _delete,
  list,
  get
};
