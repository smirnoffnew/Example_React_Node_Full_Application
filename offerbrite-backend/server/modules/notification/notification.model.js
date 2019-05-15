const mongoose = require('mongoose');
const { toJSONOpt, toObjectOpt } = require('../../helpers/mongoose-plugins/options');
const mongoosePaginate = require('mongoose-paginate');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const debug = require('debug')('app:user:notification');

/**
 * Notification Schema
 */
const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    message: {
      type: String
    },
    country: {
      type: String
    },
    category: {
      type: String
    },
    date: {
      type: mongoose.Schema.Types.Date
    },
    time: {
      type: String
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    messageId: {
      type: String
    },
    notificationMessage: {
      type: String
    }
  },
  { timestamps: true }
);
NotificationSchema.index({
  id: 1,
  userId: -1
});

NotificationSchema.set('toJSON', toJSONOpt);
NotificationSchema.set('toObject', toObjectOpt);

NotificationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

NotificationSchema.static = {
  /**
   * Get notification by id
   * @param {ObjectId} id - notification row id
   * @return {Promise<Notification, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((notification) => {
        debug('GET %O', notification);
        if (notification) {
          return notification;
        }
        const err = new APIError('No such notification exist', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },
  /**
   * List entities by query
   * @param {number} skip - Number of entities to be skipped.
   * @param {number} limit - Limit number of entities to be returned.
   * @param {object} query - query to search
   * @returns {Promise<List result<Category>>}
   */
  list({ skip = 0, limit = 50, query = {} } = {}) {
    debug('LIST %O, limit %s, skip %s', query, limit, skip);
    return this.paginate(query, {
      sort: { emeil: -1 },
      limit: +limit,
      offset: +skip
    });
  }
};

NotificationSchema.plugin(mongoosePaginate);

/**
 * @typedef Notification
 */
module.exports = mongoose.model('Notification', NotificationSchema);
