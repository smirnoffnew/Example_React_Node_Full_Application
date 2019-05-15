const log = require('../../helpers/winston')
  .getLogger({ name: 'categories:ctrl' });
const debug = require('debug')('app:category:ctrl');
const Category = require('./category.model');

const ENAME = 'category';
const EFIELD = `$${ENAME}`;

/**
 * Load entity and append it to req
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @param {String} id - id of entity
 */
const load = (req, res, next, id) => Category.get(id)
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
 * @property {string} req.body.name - The name of category.
 * @property {string} req.body.description - The description of category.
 */
const create = async (req, res, next) => {
  try {
    const savedDoc = await new Category({
      name: req.body.name,
    }).save();
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
 * @property {string} req.body.name - The name of category
 * @property {string} req.body.description - The description of category
 */
const update = async (req, res, next) => {
  try {
    const doc = req[EFIELD];
    await doc.update(req.body, { new: true });
    req[EFIELD] = await Category.get(doc.id);
    log.info('entity updated %s', doc.id);
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * List entities by query
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @property {string} req.query.skip - The numbers of entities to skip.
 * @property {string} req.query.limit - The limit of entities.
 */
const list = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0, all = false } = req.query;
    if (all) {
      const docs = (await Category.find()).map(e => e.name);
      return res.json({
        docs,
        total: docs.length,
        offset: 0,
        limit: docs.length
      });
    }
    const paginatedResult = await Category.list({
      limit,
      skip
    });
    return res.json(paginatedResult);
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
module.exports = {
  delete: remove,
  load,
  get,
  create,
  update,
  list,
};
