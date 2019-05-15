const mongoose = require('mongoose');
const privatePaths = require('../../helpers/mongoose-plugins/private-paths');
const { toJSONOpt, toObjectOpt } = require('../../helpers/mongoose-plugins/options');
const mongoosePaginate = require('mongoose-paginate');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const debug = require('debug')('app:business:model');
const { LocationSchema, MobileNumberSchema } = require('../../helpers/schemas/index');
const validator = require('validator');
const storageCtrl = require('../storage/storage.controller');
const possibleImageUrlsFields = require('./business.images.fields');
/**
 * Business Schema
 */
const BusinessSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
      trim: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessUser',
      required: true
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true
    },
    description: {
      type: String,
      trim: true
    },
    logoUrl: {
      type: String,
      default: ''
    },
    locations: {
      type: [LocationSchema],
      required: true
    },
    mobileNumbers: {
      type: [MobileNumberSchema],
      default: [],
      required: true
    },
    websiteUrl: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);
BusinessSchema.index({
  brandName: 1,
  isVerified: 1
});
BusinessSchema.set('toJSON', toJSONOpt);
BusinessSchema.set('toObject', toObjectOpt);

BusinessSchema.post('remove', function postRemove(doc, next) {
  const Offer = mongoose.model('Offer');
  return Promise.all([
    Offer.removeByBusiness(doc),
    storageCtrl.deleteImagesReferences(doc._doc, possibleImageUrlsFields)
  ])
    .then(() => next())
    .catch(next);
});

/**
 * checks, is specified user is owner of business
 * @param {User} user user for checking
 * @return {boolean} is user is owner of this business
 */
function isOwner(user) {
  return Boolean(user) && String(user.id) === String(this.ownerId);
}

BusinessSchema.virtual('owner', {
  ref: 'BusinessUser',
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true
});

BusinessSchema.methods.isOwner = isOwner;

/**
 * Statics
 */
BusinessSchema.statics = {
  /**
   * Get entity by it's id
   * @param {ObjectId} id - The objectId of entity.
   * @param {Array<string|object>} populate - array of fields that needs to be populated
   * @returns {Promise<User, APIError>}
   */
  get(id, populate = ['owner']) {
    return populate
      .reduce((query, field) => query.populate(field), this.findById(id))
      .exec()
      .then((cat) => {
        debug('GET %O', cat);
        if (cat) {
          return cat;
        }
        const err = new APIError('No such business exists', httpStatus.NOT_FOUND, true);
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
        brandName: -1
      },
      limit: +limit,
      populate,
      offset: +skip
    });
  },
  /**
   * Calculates count of businesses by user
   * @param id id of user
   * @return {Promise<number>} - count of business, created by this user
   */
  countByUser({ id }) {
    if (!validator.isMongoId(id)) throw new Error('Param id is not a MongoDB id');
    return this.countDocuments({ ownerId: id }).exec();
  },
  /**
   * deletes all businesses by owner id
   * @param ownerId id of owner
   */
  async removeByOwner({ id: ownerId }) {
    if (!ownerId) {
      throw new Error('OwnerId must have a value');
    }
    const businesses = await this.find({ ownerId }).select({ _id: 1 });
    return Promise.all(businesses.map(b => b.remove()));
  }
};

BusinessSchema.plugin(privatePaths);
BusinessSchema.plugin(mongoosePaginate);

/**
 * @typedef Business
 */
module.exports = mongoose.model('Business', BusinessSchema);
