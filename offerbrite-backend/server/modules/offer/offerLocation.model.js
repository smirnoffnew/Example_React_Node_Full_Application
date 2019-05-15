const mongoose = require('mongoose');
const { toJSONOpt, toObjectOpt } = require('../../helpers/mongoose-plugins/options');
const mongoosePaginate = require('mongoose-paginate');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const debug = require('debug')('app:locationOfOffer:model');
const { LocationSchema } = require('../../helpers/schemas');

/**
 * OfferLocationSchema Schema
 */
const OfferLocationSchema = new mongoose.Schema(
  {
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: true
    },
    loc: LocationSchema
  }, { timestamps: false }
);
OfferLocationSchema.index({
  'loc._position': '2dsphere',
}, {
  name: 'Index by position'
});
OfferLocationSchema.index({
  'loc.address.country': 'text',
  'loc.address.state': 'text',
  'loc.address.region': 'text',
  'loc.address.city': 'text',
  offerId: -1
}, {
  name: 'Index by address',
  weights: {
    'loc.address.city': 50,
    'loc.address.country': 25,
    'loc.address.state': 20,
    'loc.address.region': 20
  }
});
OfferLocationSchema.set('toJSON', toJSONOpt);
OfferLocationSchema.set('toObject', toObjectOpt);

OfferLocationSchema.virtual('offer', {
  ref: 'Offer',
  localField: 'offerId',
  foreignField: '_id',
  justOne: true
});

/**
 * Statics
 */
OfferLocationSchema.statics = {
  /**
   * Get entity by it's id
   * @param {ObjectId} id - The objectId of entity.
   * @param {Array<string|object>} populate - array of fields that needs to be populated
   * @returns {Promise<User, APIError>}
   */
  get(id, populate = []) {
    return populate.reduce((query, field) => query.populate(field), this.findById(id))
      .exec()
      .then((cat) => {
        debug('GET %O', cat);
        if (cat) {
          return cat;
        }
        const err = new APIError('No such offer exists', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },
  /**
   * List entities by query
   * @param {number} skip - Number of entities to be skipped.
   * @param {number} limit - Limit number of entities to be returned.
   * @param {object} query - query to search
   * @param {Array<string|object>} populate - array of fields that needs to be populated
   * @returns {Promise<PaginationResult<Category>>}
   */
  list({
         skip = 0, limit = 50, query = {}, populate = []
       } = {}) {
    debug('LIST %O, limit %s, skip %s', query, limit, skip);
    return this.paginate(query, {
      sort: {
        createdAt: -1,
      },
      limit: +limit,
      populate,
      offset: +skip
    });
  },
  /**
   * Create new documents LocationOfOffer for each provided location of offer
   * @property {LocationSchema[]} locations locations of offer
   * @property {ObjectId} if of offer
   * @return {Promise<OfferLocationSchema[]>} array of created docs
   */
  createByOffer({ locations, id: offerId }) {
    if (!locations || !offerId) throw new Error('Invalid arguments');
    return Promise.all(locations.map(loc => new this({
      offerId,
      loc
    }).save()));
  },
  /**
   * Deletes documents, associated with specified offer
   * @property {ObjectId} offerId - id of offer
   * @return {Promise<OfferLocationSchema[]>} all removed locationOfOffer
   */
  removeByOffer({ id: offerId }) {
    return this.remove({ offerId });
  },
  /**
   * Deletes all created offers and fill DB with new ones
   * @param offer old offer
   * @return {Promise<OfferLocationSchema[]>}
   */
  async updateByOffer(offer) {
    await this.removeByOffer(offer);
    return this.createByOffer(offer);
  }
};

OfferLocationSchema.plugin(mongoosePaginate);

/**
 * @typedef OfferLocationSchema
 */
module.exports = mongoose.model('OfferLocationSchema', OfferLocationSchema);
