const mongoose = require('mongoose');
const privatePaths = require('../../helpers/mongoose-plugins/private-paths');
const { toJSONOpt, toObjectOpt } = require('../../helpers/mongoose-plugins/options');
const mongoosePaginate = require('mongoose-paginate');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const debug = require('debug')('app:category:model');
/**
 * User Schema
 */
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
  }
);
CategorySchema.index({ name: -1 });
CategorySchema.set('toJSON', toJSONOpt);
CategorySchema.set('toObject', toObjectOpt);

/**
 * Statics
 */
CategorySchema.statics = {
  /**
   * Get entity by it's id
   * @param {ObjectId} id - The objectId of entity.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((cat) => {
        debug('GET %O', cat);
        if (cat) {
          return cat;
        }
        const err = new APIError('No such category exists', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },
  /**
   * List entities by query
   * @param {number} skip - Number of entities to be skipped.
   * @param {number} limit - Limit number of entities to be returned.
   * @param {object} query - query to search
   * @returns {Promise<PaginationResult<Category>>}
   */
  list({ skip = 0, limit = 50, query = {} } = {}) {
    debug('LIST %O, limit %s, skip %s', query, limit, skip);
    return this.paginate(query, {
      sort: { name: -1 },
      limit: +limit,
      offset: +skip
    });
  }
};

CategorySchema.plugin(privatePaths);
CategorySchema.plugin(mongoosePaginate);

/**
 * @typedef Category
 */
module.exports = mongoose.model('Category', CategorySchema);
