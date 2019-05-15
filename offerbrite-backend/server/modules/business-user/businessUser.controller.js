const BusinessUser = require('./businessUser.model');
const log = require('../../helpers/winston')
  .getLogger({ name: 'business-user:ctrl' });
const debug = require('debug')('app:business-user:ctrl');

const ENAME = 'businessUser';
const EFIELD = `$${ENAME}`;

/**
 * Load entity and append it to req
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @param {String} id - id of entity
 */
const load = (req, res, next, id) => BusinessUser.get(id)
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
 * @property {string} req.body.password - The password of user.
 */
const create = async (req, res, next) => {
  try {
    const savedDoc = await new BusinessUser(req.body).save();
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
 * @property {string} req.body.username - The username of businessUser.
 */
const update = async (req, res, next) => {
  try {
    const doc = req[EFIELD];
    await doc.update(req.body, { new: true });
    req[EFIELD] = await BusinessUser.get(doc.id);
    log.info('entity updated %s', doc);
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
    const paginatedResult = await BusinessUser.list({
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
    req[EFIELD] = doc;
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
    req[EFIELD] = await BusinessUser.get(doc.id);
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
module.exports = {
  login,
  updatePassword,
  updateEmail,
  load,
  get,
  create,
  update,
  list,
  delete: remove
};
