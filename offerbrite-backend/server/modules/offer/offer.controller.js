const log = require('../../helpers/winston')
  .getLogger({ name: 'offers:ctrl' });
const debug = require('debug')('app:offers:ctrl');
const Offer = require('./offer.model');
const offerQuery = require('./offer.query');
const OfferLocation = require('./offerLocation.model');
const helpers = require('../../helpers/utils/index');
const possibleImageUrlsFields = require('./offer.images.fields');

const ENAME = 'offer';
const EFIELD = `$${ENAME}`;

const monthNames = [
  'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
];
const dayNames = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday'
];
const getNumberOfWeek = (date) => {
  const today = new Date(date);
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

const createDateObejct = (offer) => {
  const views = offer.views.map((view) => {
    const date = new Date(view.date);
    return {
  year: date.getFullYear(),
  month: monthNames[date.getMonth()],
  day: dayNames[date.getDay() - 1],
  week: getNumberOfWeek(view.date)
};
  });
  offer._doc.views = views;
  return offer;
};
/**
 * Load entity and append it to req
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @param {String} id - id of entity
 */
const load = (req, res, next, id) => Offer.get(id)
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
  const offer = req[EFIELD];
  return res.json(offer.views
    ? createDateObejct(offer).toJSON()
    : offer.toJSON());
};

/**
 * Create new entity
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const create = async (req, res, next) => {
  try {
    const savedDoc = await new Offer({
      ...req.body,
      ownerId: req.authUser.id,
      businessId: req.$business.id
    }).save();
    log.info('new entity created %s', savedDoc.id);
    await helpers.storage.updateReferencesToImages({}, savedDoc._doc, possibleImageUrlsFields);
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
    log.info('entity updated %s', doc.id);
    req[EFIELD] = await Offer.get(doc.id);
    await helpers.storage.updateReferencesToImages(doc._doc, req.body, possibleImageUrlsFields);
    if (req.body.locations) {
      await OfferLocation.updateByOffer(req[EFIELD]);
    }
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
    const {
      limit = 50, skip = 0, populate = [], ...query
    } = req.query;
    const paginatedResult = await Offer.list({
      limit,
      skip,
      populate,
      query: await offerQuery.process(query)
    });
    paginatedResult.docs = paginatedResult.docs.length
    ? paginatedResult.docs.map(offer => (offer.views
      ? createDateObejct(offer)
      : offer))
    : paginatedResult.docs;
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
/**
 * Add shared in offer by id
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 */
const addShared = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.offerId);
    const updatedOffer = await offer.update({ shared: offer.shared + 1 });
    log.info('entity was updated %s', updatedOffer.id);
    return res.json({ status: 'OK', message: 'Share count added', updatedOffer });
  } catch (e) {
    return next(e);
  }
};
const addFavorite = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.offerId);
    const updatedOffer = await offer.update({ favorites: offer.favorites + 1 });
    log.info('entity was updated %s', updatedOffer.id);
    return res.json({ status: 'OK', message: 'Share count added', updatedOffer });
  } catch (e) {
    return next(e);
  }
};
const addView = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.offerId);
    const updatedOffer = await offer.update({
  views: [
      ...offer.views,
      { date: Date() }
    ]
});
    log.info('entity was updated %s', updatedOffer.id);
    return res.json({ status: 'OK', message: 'Share count added', updatedOffer });
  } catch (e) {
    return next(e);
  }
};

const imageUrlsFields = [
  `${EFIELD}._doc.imagesUrls`
];
module.exports = {
  imageUrlsFields,
  delete: remove,
  load,
  get,
  create,
  update,
  list,
  addShared,
  addFavorite,
  addView
};
