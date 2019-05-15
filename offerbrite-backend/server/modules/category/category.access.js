const ACE = require('../../../config/index').rolesConfig;
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');

function checkAccessToUser(action) {
  return async (req, res, next) => {
    if (
      req.authUser
      && (await ACE.checkAccess(req.authUser.role, action, {
        category: req.$category,
        authUser: req.authUser
      }))
    ) {
      return next();
    }
    return next(new APIError(null, httpStatus.FORBIDDEN, false));
  };
}

const create = checkAccessToUser('category:create');
const update = checkAccessToUser('category:update');
const _delete = checkAccessToUser('category:delete');
const get = checkAccessToUser('category:get');
const list = checkAccessToUser('category:list');

module.exports = {
  update,
  create,
  delete: _delete,
  list,
  get
};
