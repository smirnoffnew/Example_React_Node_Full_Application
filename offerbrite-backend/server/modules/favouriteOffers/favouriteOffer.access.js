const ACE = require('../../../config/index').rolesConfig;
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');

function checkAccessToUser(action) {
  return async (req, res, next) => {
    if (
      req.authUser
      && (await ACE.checkAccess(req.authUser.role, action, {
        user: req.$user,
        authUser: req.authUser
      }))
    ) {
      return next();
    }
    return next(new APIError(null, httpStatus.FORBIDDEN, false));
  };
}

const create = checkAccessToUser('user:favouritesOffers:create');
const _delete = checkAccessToUser('user:favouritesOffers:delete');
const list = checkAccessToUser('user:favouritesOffers:list');
const get = checkAccessToUser('user:favouritesOffers:get');

module.exports = {
  create,
  get,
  delete: _delete,
  list,
};
