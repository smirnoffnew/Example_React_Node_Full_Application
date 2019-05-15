const User = require('./user.model');
const utils = require('../user/scripts');
const log = require('../../helpers/winston').getLogger({ name: 'user:ctrl' });
const debug = require('debug')('app:user:ctrl');

const ENAME = 'user';
const EFIELD = `$${ENAME}`;

/**
 * Load entity and append it to req
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @param {String} id - id of entity
 */
const load = (req, res, next, id) => User.get(id)
    .then((doc) => {
      req[EFIELD] = doc; // eslint-disable-line no-param-reassign
      debug('LOAD entity %O', doc);
      return next();
    })
    .catch(e => next(e));

/**
 * Get entity by it's id
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 */
const get = (req, res) => {
  debug('GET entity %O', req[EFIELD]);
  return res.json(req[EFIELD].toJSON());
};

/**
 * Create new entity
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 */
const create = async (req, res, next) => {
  try {
    const savedDoc = await new User(req.body).save();
    log.info('new entity created %s', savedDoc.id);
    req[EFIELD] = savedDoc;
    return next();
  } catch (err) {
    return next(err);
  }
};
/**
 * Update entity by id
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @property {string} req.body.username - The username of user.
 */
const update = async (req, res, next) => {
  try {
    const doc = req[EFIELD];
    await doc.update(req.body, { new: true });
    req[EFIELD] = await User.get(doc.id);
    log.info('entity updated %s', doc.id);
    return next();
  } catch (err) {
    return next(err);
  }
};
/**
 * List entities by quey
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @property {string} req.query.skip - The email of user.
 * @property {string} req.query.limit - The username of user.
 */
const list = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0, populate = false } = req.query;
    const paginatedResult = await User.list({
      limit,
      skip,
      populate
    });
    return res.json({
      ...paginatedResult,
      docs: paginatedResult.docs.map(e => e.toJSON())
    });
  } catch (err) {
    return next(err);
  }
};
/**
 * Delete entity by it's id
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const remove = async (req, res, next) => {
  try {
    const doc = req[EFIELD];
    const deletedDoc = await doc.remove();
    log.info('entity was deleted %s', deletedDoc.id);
    req[EFIELD] = deletedDoc;
    return next();
  } catch (err) {
    return next(err);
  }
};
/**
 * Update user's password
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @property {string} req.body.password - The password of user.
 */
const updatePassword = async (req, res, next) => {
  try {
    const doc = req[EFIELD];
    doc.password = req.body.password;
    await doc.save();
    log.info('entity password updated %s', doc.id);
    return next();
  } catch (err) {
    return next(err);
  }
};
/**
 * Update user's email
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @property {string} req.body.email - The email of user.
 */
const updateEmail = async (req, res, next) => {
  try {
    const doc = req[EFIELD];
    await doc.update(req.body, { new: true });
    req[EFIELD] = await User.get(doc.id);
    log.info('entity email updated %s', doc.id);
    return next();
  } catch (err) {
    return next(err);
  }
};
/**
 * Get tokens and own profile
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 */
const login = (req, res) => res.json({
    user: req[EFIELD].toJSON(),
    tokens: req[EFIELD].genAuthTokens()
  });

/**
 * Initiates admin user creation
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const initAdmin = (req, res, next) => utils
    .initAdminUserCreation(req)
    .then(data => (data
        ? res.json({ status: 'OK', data })
        : res.json({ status: 'ERROR', message: 'admin name already taken' })))
    .catch(next);

/**
 * Login to admin role
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */

const loginAdmin = (req, res, next) => utils
    .getAdminUser(req)
    .then(data => (data ? res.json({ status: 'OK', data }) : res.json({ status: 'ERROR', data })))
    .catch(next);

/**
 * Login to admin role
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */

const loginToAdmin = (req, res, next) => utils
    .getLoginAdmin(req.authUser)
    .then(data => (data ? res.json({ status: 'OK', data }) : res.json({ status: 'ERROR', data })))
    .catch(next);

/**
 *Super admin can get all Admins
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */

const getAllAdmin = (req, res, next) => utils
    .getAllAdmin(req.authUser)
    .then(data => (data
        ? res.json({ status: 'OK', data })
        : res.json({ status: 'ERROR', message: 'you have incorect role' })))
    .catch(next);

/**
 * Super Admin can update admin
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */

const updateAdmin = (req, res, next) => utils
    .updateAdmin(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'user admin change', data })
        : res.json({ status: 'ERROR', message: 'you have incorect role' })))
    .catch(next);

/**
 * Login to admin role
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */

const deleteAdmin = (req, res, next) => utils
    .deleteAdmin(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'user admin delete' })
        : res.json({ status: 'ERROR', message: 'you have incorect role' })))
    .catch(next);

/**
 * Admin can get all users
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */

const getAllUsers = (req, res, next) => utils
    .getAllUsers(req)
    .then(data => (data
        ? res.json({ status: 'OK', data })
        : res.json({ status: 'ERROR', message: 'you have incorect role' })))
    .catch(next);

/**
 * Admin can get all business users
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const getAllBusinessUsers = (req, res, next) => utils
    .getAllBusinessUsers(req)
    .then(data => (data
        ? res.json({ status: 'OK', data: data.filter(Boolean) })
        : res.json({ status: 'ERROR', message: 'you have incorect role' })))
    .catch(next);

/**
 * Admin can get  business user by id
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const updateBusinesUserById = (req, res, next) => utils
    .updateBusinesUserById(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'business user updated', data })
        : res.json({ status: 'ERROR', message: 'you have incorect role or send bad data' })))
    .catch(next);
/**
 * Admin can get all offers
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.Next} next
 */
const getAllOffers = (req, res, next) => utils
    .getAllOffers(req)
    .then(data => (data
        ? res.json({ status: 'OK', data })
        : res.json({ status: 'ERROR', message: 'Bad request!' })))
    .catch(next);

/**
 * Admin can get  offer by id
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const getOfferById = (req, res, next) => utils
    .getOfferById(req)
    .then(data => (data
        ? res.json({ status: 'OK', data })
        : res.json({ status: 'ERROR', message: 'You have incorect role or report is not defined!' })))
    .catch(next);

/**
 * Admin can delete  offer by id
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const deleteOfferById = (req, res, next) => utils
    .deleteOfferById(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'offer delete' })
        : res.json({ status: 'ERROR', message: 'You have incorect role or report is not defined!' })))
    .catch(next);

/**
 * Admin can update offer by id
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const updateOfferById = (req, res, next) => utils
    .updateOfferById(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'offer change', data })
        : res.json({ status: 'ERROR', message: 'You have incorect role!' })))
    .catch(next);

/**
 * Admin can delete  report by id
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const deleteReportById = (req, res, next) => utils
    .deleteReportById(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'report delete', data })
        : res.json({ status: 'ERROR', message: 'You have incorect role or report is not defined!' })))
    .catch(next);

/**
 * Admin can delete  user by id
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const deleteUserById = (req, res, next) => utils
    .deleteUserById(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'user delete' })
        : res.json({ status: 'ERROR', message: 'You have incorect role or user is not defined!' })))
    .catch(next);

/**
 * Admin can delete business user by id
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const deleteBusinessUserById = (req, res, next) => utils
    .deleteBusinessUserById(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'bussines user delete' })
        : res.json({ status: 'ERROR', message: 'You have incorect role or user is not defined!' })))
    .catch(next);

/**
 * Admin can update user by id
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const updateUserById = (req, res, next) => utils
    .updateUserById(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'user updated', data })
        : res.json({ status: 'ERROR', message: 'You have incorect role or user is not defined!' })))
    .catch(next);

/**
 * Admin can get business by id
 * @param {Express.Request} req reqest object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const getBusinessById = (req, res, next) => utils
    .getBusinessById(req)
    .then(data => (data
        ? res.json({ status: 'OK', data })
        : res.json({ status: 'ERROR', message: 'You have incorect role or busines in not defined' })))
    .catch(next);

const updateUserCountry = (req, res, next) => utils
    .updateUserCountry(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'Country add in user', data })
        : res.json({ status: 'ERROR', message: 'User is not defined!' })))
    .catch(next);

const updateUserCategories = (req, res, next) => utils
    .updateUserCategories(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'Category add in user', data })
        : res.json({ status: 'ERROR', message: 'User is not defined!' })))
    .catch(next);

const addUserTokenAndOperationSystem = (req, res, next) => utils
    .addUserTokenAndOperationSystem(req)
    .then(data => (data
        ? res.json({ status: 'OK', message: 'Token and OS add in user', data })
        : res.json({ status: 'ERROR', message: 'User is not defined!' })))
    .catch(next);

module.exports = {
  getAllBusinessUsers,
  getAllUsers,
  updateAdmin,
  deleteAdmin,
  getAllAdmin,
  loginToAdmin,
  loginAdmin,
  login,
  initAdmin,
  updatePassword,
  updateEmail,
  load,
  get,
  create,
  update,
  list,
  delete: remove,
  getAllOffers,
  getOfferById,
  deleteOfferById,
  updateOfferById,
  deleteReportById,
  deleteUserById,
  deleteBusinessUserById,
  updateUserById,
  updateBusinesUserById,
  getBusinessById,
  updateUserCountry,
  updateUserCategories,
  addUserTokenAndOperationSystem
};
