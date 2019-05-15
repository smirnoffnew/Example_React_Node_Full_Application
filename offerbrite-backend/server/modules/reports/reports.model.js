const { toJSONOpt, toObjectOpt } = require('../../helpers/mongoose-plugins/options');
const debug = require('debug')('app:user:model');
const privatePaths = require('../../helpers/mongoose-plugins/private-paths');
const mongoosePaginate = require('mongoose-paginate');
const httpStatus = require('http-status');
const APIError = require('../../helpers/APIError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../../../config/index');
const FavouriteOffer = require('../favouriteOffers/favouriteOffer.model');
const mongoose = require('mongoose');

/**
 * User Schema
 */
const ReportsSchema = new mongoose.Schema(
  {
    userID: {
      unique: false,
      lowercase: true,
      type: String,
      required: true
    },
    reason: {
      type: String,
    },
    // title: {
    //   type: String,
    // },
    // description: {
    //   type: String,
    // },
    offerId: {
      type: String,
    }
  },
  { timestamps: true }
);

ReportsSchema.index({
  id: 1
});

ReportsSchema.set('toJSON', toJSONOpt);
ReportsSchema.set('toObject', toObjectOpt);

ReportsSchema.post('remove', async function onRemove(doc, next) {
  await Promise.all([FavouriteOffer.removeByUser(doc)]);
  next();
});

/**
 * Generate auth JWT tokens
 */

function genAuthTokens() {
  return {
    access: this.genJWTAccessToken(),
    refresh: this.genJWTRefreshToken()
  };
}

// Generate access token
function genJWTRefreshToken() {
  return {
    expiredIn: config.auth.jwtExpRefresh + new Date().getTime(),
    token: jwt.sign({
      id: this.id,
      secret: this.jwtSecret
    }, config.auth.jwtSecretRefreshUser, {
      expiresIn: Math.floor(config.auth.jwtExpRefresh / 1000)
    })
  };
}

// Generate refresh token
function genJWTAccessToken() {
  return {
    expiredIn: config.auth.jwtExpAccess + new Date().getTime(),
    token: jwt.sign({
      id: this.id,
      secret: this.jwtSecret
    }, config.auth.jwtSecretAccessUser, {
      expiresIn: Math.floor(config.auth.jwtExpAccess / 1000)
    })
  };
}

const getTimeoutForPasswordReset = async (id) => {
  const waitedTime = config.auth.jwtExpPasswordReset - (await UserRedis.getPasswordSecretTTL(id)) * 1000; // eslint-disable-line
  const ms = config.auth.passwordResetTimeout - waitedTime;
  return `${Math.floor(ms / (60 * 1000))}m ${Math.floor((ms % (60 * 1000)) / 1000)}s`;
};

// Generate password reset token
async function genJWTPasswordResetToken() {
  if (!(await UserRedis.isPasswordResetSecretExpired(this.id))) {
    throw new APIError(
      `Wait ${await getTimeoutForPasswordReset(this.id)} before reset password again`,
      httpStatus.BAD_REQUEST,
      true
    );
  }
  const secretForResetPasswordToken = await bcrypt.genSalt(10);
  await UserRedis.addPasswordResetToken(this.id, secretForResetPasswordToken);
  return jwt.sign(
    {
      id: this.id,
      secret: secretForResetPasswordToken
    },
    config.auth.jwtSecretPasswordReset,
    {
      expiresIn: Math.floor(config.auth.jwtExpPasswordReset / 1000)
    }
  );
}

// Compare password input to password saved in database
function comparePassword(pw) {
  return bcrypt.compare(pw, this.password);
}

ReportsSchema.methods.genAuthTokens = genAuthTokens;
ReportsSchema.methods.genJWTAccessToken = genJWTAccessToken;
ReportsSchema.methods.genJWTRefreshToken = genJWTRefreshToken;
ReportsSchema.methods.genJWTPasswordResetToken = genJWTPasswordResetToken;
ReportsSchema.methods.comparePassword = comparePassword;

/**
 * Statics
 */
ReportsSchema.statics = {
  /**
   * Get user by his email
   * @param {stirng} email - The email of user.
   * @returns {Promise<User, APIError>}
   */
  getByEmail(email) {
    return this.findOne({ email })
      .exec()
      .then((user) => {
        debug('GET by EMAIL %O', user);
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },
  /** Get user by his email and password
   * @param {string} password - password of user
   * @param {string} email - email of user
   * @returns {Promise<User,APIError}
   */
  async getByCredentials({ email, password }) {
    debug('GET BY CRED %O', {
      email,
      password
    });
    const user = await this.findOne({ email })
      .select('+password')
      .exec();
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    const err = new APIError('No such user exists!', httpStatus.NOT_FOUND, true);
    throw err;
  },
  /**
   * Get user by token's payload
   * @param {object} payload decoded token info
   */
  async getByToken(payload) {
    debug('GET BY TOKEN %O', payload);
    return this.findOne({
      _id: payload.id,
      jwtSecret: `${payload.secret}`
    });
  },
  /**
   * Get user by reset password token's payload
   * @param {object} payload decoded token info
   */
  async getByResetPasswordToken(payload) {
    debug('GET BY reset password TOKEN %O', payload);
    // check, does a secret in the token is equals to secret in Redis
    if ((await UserRedis.getPasswordResetToken(payload.id)) === payload.secret) {
      await UserRedis.delPasswordResetToken(payload.id);
      return this.findById(payload.id);
    }
    return new APIError(
      'You are already created an another password reset token',
      httpStatus.UNAUTHORIZED,
      true
    );
  },
  /**
   * Get entity by it's id
   * @param {ObjectId} id - The objectId of entity.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        debug('GET %O', user);
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  /**
   * List entities in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of entities to be skipped.
   * @param {number} limit - Limit number of entities to be returned.
   * @param {object} query - query to search
   * @returns {Promise<PaginationResult<User>}
   */
  list({ skip = 0, limit = 50, query = {} } = {}) {
    debug('LIST %O, limit %s, skip %s', query, limit, skip);
    return this.paginate(query, {
      sort: { email: -1 },
      limit: +limit,
      offset: +skip,
    });
  }
};

ReportsSchema.plugin(privatePaths);
ReportsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Reports', ReportsSchema);
