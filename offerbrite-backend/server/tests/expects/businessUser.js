const all = require('./all');
const ValidationSchema = require('../../helpers/tests/ValidationSchema');

const schema = new ValidationSchema({
  __v: {
    type: 'string',
    forbidden: true
  },
  _id: {
    type: 'string',
    forbidden: true
  },
  id: 'string',
  password: {
    forbidden: true,
    type: 'string'
  },
  email: 'string',
  createdAt: 'string',
  updatedAt: 'string',
  isNotificationsEnabled: 'boolean'
});

const expectEntity = (businessUser, etaloneFields = {}) => {
  schema.validate(businessUser);
  schema.checkEquals(businessUser, etaloneFields);
};
const expectEntityUpdated = (user, newData) => {
  expectEntity(user, newData);
};

// check access token of user is not outdated
const expectAccessTokenIsValid = (token, done) => {
  all.expectTokenIsValid('/api/v1/auth/business/check-access', token, done);
};
// check refresh token of user is not outdated
const expectRefreshTokenIsValid = (token, done) => {
  all.expectTokenIsValid('/api/v1/auth/business/check-refresh', token, done);
};

module.exports = {
  expectEntity,
  expectEntityUpdated,
  expectAccessTokenIsValid,
  expectRefreshTokenIsValid
};
