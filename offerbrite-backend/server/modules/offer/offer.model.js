const mongoose = require('mongoose');
const privatePaths = require('../../helpers/mongoose-plugins/private-paths');
const { toJSONOpt, toObjectOpt } = require('../../helpers/mongoose-plugins/options');
const mongoosePaginate = require('mongoose-paginate');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const debug = require('debug')('app:offer:model');
const { LocationSchema } = require('../../helpers/schemas/index');
const _ = require('lodash');
const OfferLocation = require('./offerLocation.model');
const FavouriteOffer = require('../favouriteOffers/favouriteOffer.model');
const storageCtrl = require('../storage/storage.controller');
const possibleImageUrlsFields = require('./offer.images.fields');
const OfferViewsSchema = require('./offerViews.model');
/**
 * Business Schema
 */
const OfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      index: -1,
      lowercase: true,
      required: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessUser',
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    isDateHidden: {
      type: Boolean,
      default: false
    },
    endDate: {
      type: Date,
      index: -1,
      required: true
    },
    startDate: {
      type: Date,
      index: -1,
      required: true
    },
    fullPrice: Number,
    discount: Number,
    imagesUrls: {
      type: [String],
      default: []
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
    },
    locations: {
      type: [LocationSchema],
      required: true
    },
    favorites: {
      type: Number,
      default: 0
    },
    shared: {
      type: Number,
      default: 0
    },
    views: {
      type: [OfferViewsSchema],
      required: false
    }
  }, { timestamps: true }
);
OfferSchema.index({
  category: -1,
  title: -1,
  endDate: -1,
  startDate: -1,
  _id: -1
});
OfferSchema.index({
  title: 'text',
  category: -1,
  endDate: -1,
  startDate: -1,
  _id: -1
}, {
  name: 'AllFieldsIndex',
  weights: {
    title: 1,
    category: 5
  }
});
OfferSchema.set('toJSON', toJSONOpt);
OfferSchema.set('toObject', toObjectOpt);

OfferSchema.pre('save', async function onSave(next) {
  if (this.isNew) {
    await OfferLocation.createByOffer(this);
  }
  next();
});

OfferSchema.post('remove', async function onRemove(doc, next) {
  await Promise.all([
    OfferLocation.removeByOffer(doc),
    FavouriteOffer.removeByOffer(doc),
    OfferViewsSchema.removeByOffer(doc),
    storageCtrl.deleteImagesReferences(doc._doc, possibleImageUrlsFields)
  ]);
  next();
});

/**
 * checks, is specified user is owner of offer
 * @param {string} id id user of for checking
 * @return {boolean} is user is owner of this business
 */
function isOwner({ id }) {
  return String(id) === String(this.ownerId);
}

OfferSchema.virtual('owner', {
  ref: 'BusinessUser',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true
});

OfferSchema.virtual('business', {
  ref: 'Business',
  localField: 'businessId',
  foreignField: '_id',
  justOne: true
});
OfferSchema.methods.isOwner = isOwner;

/**
 * Statics
 */
OfferSchema.statics = {
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
    populate = _.isString(populate) ? [populate] : populate;
    let mongoSearchQuery = this.find(query, { score: { $meta: 'textScore' } })
      .sort({
        createdAt: -1,
        score: { $meta: 'textScore' }
      })
      .limit(+limit)
      .skip(+skip);
    mongoSearchQuery = populate.reduce((memo, value) => {
      memo.populate(value);
      return memo;
    }, mongoSearchQuery);
    return Promise.all([
      mongoSearchQuery,
      this.countDocuments(query)
    ])
      .then(results => ({
        docs: results[0],
        skip,
        limit,
        total: results[1]
      }));
  },
  async removeByBusiness({ id: businessId }) {
    if (!businessId) {
      throw new Error('BusinessId must have a value');
    }
    const offers = await this.find({ businessId })
      .select({ _id: 1 });
    return Promise.all(offers.map(offer => offer.remove()));
  }
};

OfferSchema.plugin(privatePaths);
OfferSchema.plugin(mongoosePaginate);

/**
 * @typedef Offer
 */
module.exports = mongoose.model('Offer', OfferSchema);
