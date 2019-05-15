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

const update = checkAccessToUser('user:update');
const updatePassword = checkAccessToUser('user:update:password');
const updateEmail = checkAccessToUser('user:update:email');
const _delete = checkAccessToUser('user:delete');
const get = checkAccessToUser('user:get');
const list = checkAccessToUser('user:list');
const listFavouritesOffers = checkAccessToUser('user:list:favouritesOffers');
module.exports = {
  listFavouritesOffers,
  update,
  updatePassword,
  updateEmail,
  delete: _delete,
  list,
  get
};
