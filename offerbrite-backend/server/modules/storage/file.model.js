const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const debug = require('debug')('app:storage:file:model');
const Firebase = require('../../services/firebase')
  .getClient();
const mongoosePaginate = require('mongoose-paginate');
const privatePaths = require('../../helpers/mongoose-plugins/private-paths');
const { toJSONOpt, toObjectOpt } = require('../../helpers/mongoose-plugins/options');

/**
 * Business Schema
 */
const FileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      unique: true
    },
    referencesCount: {
      type: Number,
      required: true,
      index: 1,
      default: 0
    },
    firebaseUrl: {
      type: String,
      index: 1,
      required: true
    },
    type: {
      enum: ['image'],
      type: String,
      required: true
    }
  }, { timestamps: true }
);
FileSchema.set('toJSON', toJSONOpt);
FileSchema.set('toObject', toObjectOpt);

FileSchema.post('remove', async function onRemove(doc, next) {
  await Promise.all([
    Firebase.storage.deleteFile(doc.fileName)
  ]);
  next();
});

/**
 * Statics
 */
FileSchema.statics = {
  /**
   * Get entity by it's id
   * @param {ObjectId} id - The objectId of entity.
   * @param {Array<string|object>} populate - array of fields that needs to be populated
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((doc) => {
        debug('GET %O', doc);
        if (doc) {
          return doc;
        }
        const err = new APIError('No such fileÒ exists', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },
  getByFileName(fileName, select = '') {
    return this.findOne({ fileName })
      .select(select)
      .exec()
      .then((doc) => {
        debug('GET %O', doc);
        if (doc) {
          return doc;
        }
        const err = new APIError('No such file exists', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },
  getByUrl(firebaseUrl) {
    return this.findOne({ firebaseUrl })
      .exec()
      .then((doc) => {
        debug('GET %O', doc);
        if (doc) {
          return doc;
        }
        const err = new APIError('No such file exists', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },
  removeByFileName(fileName) {
    return this.getByFileName(fileName)
      .then(doc => doc.remove());
  },
  removeByFirebaseUrl(url) {
    return this.removeByFileName(Firebase.storage.decodeUrl(url));
  },
  addReference(firebaseUrl) {
    return this.updateOne({ firebaseUrl }, { $inc: { referencesCount: 1 } });
  },
  removeReference(firebaseUrl) {
    return this.updateOne({ firebaseUrl }, { $inc: { referencesCount: -1 } });
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
      createdAt: -1,
      limit: +limit,
      populate,
      offset: +skip
    });
  },
};
FileSchema.plugin(privatePaths);
FileSchema.plugin(mongoosePaginate);

/**
 * @typedef Offer
 */
module.exports = mongoose.model('StorageFile', FileSchema);
