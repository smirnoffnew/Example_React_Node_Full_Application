const mongoose = require('mongoose');
const { toJSONOpt, toObjectOpt } = require('../../helpers/mongoose-plugins/options');
const mongoosePaginate = require('mongoose-paginate');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const debug = require('debug')('app:viewsOfOffer:model');

const OfferViewsSchema = mongoose.Schema(
  {
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      required: true
    },
    date: {
      type: mongoose.Schema.Types.Date,
      required: true
    }
  },
  { timestamps: false }
);

OfferViewsSchema.set('toJSON', toJSONOpt);
OfferViewsSchema.set('toObject', toObjectOpt);

OfferViewsSchema.virtual('offer', {
  ref: 'Offer',
  localField: 'offerId',
  foreignField: '_id'
});

OfferViewsSchema.static = {
  /**
   * Get entity by it's id
   * @param {ObjectId} id - The objectId of entity.
   * @param {Array<string|object>} populate - array of fields that needs to be populated
   * @returns {Promise<User, APIError>}
   */
  get(id, populate = []) {
    return populate
      .reduce((query, field) => query.populate(field), this.findById(id))
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
  list({
 skip = 0, limit = 50, query = {}, populate = []
} = {}) {
    debug('LIST %O, limit %s, skip %s', query, limit, skip);
    return this.paginate(query, {
      sort: {
        createdAt: -1
      },
      limit: +limit,
      populate,
      offset: +skip
    });
  },
  /**
   * Create new documents ViewsnOfOffer for each provided location of offer
   * @property {LocationSchema[]} locations locations of offer
   * @property {ObjectId} if of offer
   * @return {Promise<OfferViewsSchema[]>} array of created docs
   */
  createByOffer({ date, id: offerId }) {
    if (!date || !offerId) throw new Error('Invalid arguments');
    return Promise.all(
      date.map(dat => new this({
          offerId,
          dat
        }).save())
    );
  },
  /**
   * Deletes documents, associated with specified offer
   * @property {ObjectId} offerId - id of offer
   * @return {Promise<OfferViewsSchema[]>} all removed locationOfOffer
   */
  removeByOffer({ id: offerId }) {
    return this.remove({ offerId });
  }
};
OfferViewsSchema.plugin(mongoosePaginate);

/**
 * @typedef OfferViewsSchema
 */
module.exports = OfferViewsSchema;
