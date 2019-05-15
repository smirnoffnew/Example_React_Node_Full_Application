const FavouriteOffer = require('./favouriteOffer.model');
const log = require('../../helpers/winston')
  .getLogger({ name: 'favOff:ctrl' });
const APIError = require('../../helpers/APIError');
const httpStatus = require('http-status');
// const debug = require('debug')('app:favOff:ctrl');

/**
 * Add offer to list
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const create = async (req, res, next) => {
  try {
    const savedDoc = await new FavouriteOffer({
      offerId: req.$offer.id,
      userId: req.$user.id
    }).save();
    log.info('new entity created %s', savedDoc.id);
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
 * @property {string} req.query.skip - The email of user.
 * @property {string} req.query.limit - The username of user.
 */
const list = async (req, res, next) => {
  try {
    const {
      limit = 50, skip = 0, populate, ...query
    } = req.query;
    const paginatedResult = await FavouriteOffer.list({
      limit,
      skip,
      populate,
      query: {
        ...query,
        userId: req.$user.id
      }
    });
    return res.json({
      ...paginatedResult,
      docs: paginatedResult.docs.map(e => e.offer.toJSON())
    });
  } catch (err) {
    return next(err);
  }
};
/**
 * Delete entity by offer's id
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const remove = async (req, res, next) => {
  try {
    const doc = await FavouriteOffer.getByUserAndOffer(req.$user.id, req.$offer.id);
    const deletedDoc = await doc.remove();
    log.info('entity was deleted %s', deletedDoc.id);
    return next();
  } catch (err) {
    return next(err);
  }
};
const itDoesNotAlreadyExistsAtFavourites = async (req, res, next) => {
  try {
    const doc = await FavouriteOffer.findOne({
      userId: req.$user.id,
      offerId: req.$offer.id
    });
    if (doc) {
      throw new APIError('This offer is already in favourites', httpStatus.BAD_REQUEST, true);
    }
    return next();
  } catch (err) {
    return next(err);
  }
};
module.exports = {
  itDoesNotAlreadyExistsAtFavourites,
  create,
  list,
  delete: remove
};
