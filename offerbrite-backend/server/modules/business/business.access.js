const ACE = require('../../../config/index').rolesConfig;
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');

function checkAccessToUser(action) {
  return async (req, res, next) => {
    if (
      req.authUser
      && (await ACE.checkAccess(req.authUser.role, action, {
        business: req.$business,
        authUser: req.authUser
      }))
    ) {
      return next();
    }
    return next(new APIError(null, httpStatus.FORBIDDEN, false));
  };
}

const create = checkAccessToUser('business:create');
const update = checkAccessToUser('business:update');
const _delete = checkAccessToUser('business:delete');
const get = checkAccessToUser('business:get');
const list = checkAccessToUser('business:list');

module.exports = {
  update,
  create,
  delete: _delete,
  list,
  get
};
