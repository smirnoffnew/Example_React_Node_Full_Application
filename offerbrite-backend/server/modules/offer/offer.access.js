const ACE = require('../../../config/index').rolesConfig;
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');

function checkAccessToUser(action) {
  return async (req, res, next) => {
    if (
      req.authUser
      && (await ACE.checkAccess(req.authUser.role, action, {
        business: req.$business,
        offer: req.$offer,
        authUser: req.authUser
      }))
    ) {
      return next();
    }
    return next(new APIError(null, httpStatus.FORBIDDEN, false));
  };
}

const create = checkAccessToUser('offer:create');
const update = checkAccessToUser('offer:update');
const _delete = checkAccessToUser('offer:delete');
const get = checkAccessToUser('offer:get');
const list = checkAccessToUser('offer:list');

module.exports = {
  update,
  create,
  delete: _delete,
  list,
  get
};
