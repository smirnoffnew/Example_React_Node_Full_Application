const mongoose = require('mongoose');
const { toJSONOpt, toObjectOpt } = require('../../helpers/mongoose-plugins/options');
const mongoosePaginate = require('mongoose-paginate');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const debug = require('debug')('app:category:model');
/**
 * User Schema
 */
const FavouritesOfferSchema = new mongoose.Schema(
  {
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  }, { timestamps: true }
);
FavouritesOfferSchema.index({
  offerId: -1,
  userId: -1,
  createdAt: -1
});

FavouritesOfferSchema.set('toJSON', toJSONOpt);
FavouritesOfferSchema.set('toObject', toObjectOpt);

FavouritesOfferSchema.virtual('offer', {
  ref: 'Offer',
  localField: 'offerId',
  foreignField: '_id',
  justOne: true
});

/**
 * Statics
 */
FavouritesOfferSchema.statics = {
  /**
   * Get entity by offer's and user's ids
   * @param {ObjectId} userId - The objectId of user.
   * @param {ObjectId} offerId - The objectId of offer.
   * @returns {Promise<FavouritesOffer, APIError>}
   */
  getByUserAndOffer(userId, offerId) {
    return this.findOne({
      userId,
      offerId
    })
      .then((doc) => {
        debug('GET %O', doc);
        if (doc) {
          return doc;
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
   * @param {array}  populate - populate search
   * @returns {Promise<PaginationResult<FavouritesOffer>>}
   */
  list({
         skip = 0,
         limit = 100,
         query = {},
         populate = []
       } = {}) {
    debug('LIST %O, limit %s, skip %s', query, limit, skip);
    return this.paginate(query, {
      sort: { createdAt: -1 },
      populate: [{
        path: 'offer',
        populate
      }],
      select: 'offerId',
      limit: +limit,
      offset: +skip
    });
  },
  removeByOffer({ id: offerId }) {
    if (!offerId) {
      throw new Error('offerId must have a value');
    }
    return this.remove({ offerId });
  },
  removeByUser({ id: userId }) {
    if (!userId) {
      throw new Error('userId must have a value');
    }
    return this.remove({ userId });
  }
};

FavouritesOfferSchema.plugin(mongoosePaginate);

/**
 * @typedef FavouritesOffer
 */
module.exports = mongoose.model('FavouritesOffer', FavouritesOfferSchema);
