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
  username: 'string',
  password: {
    forbidden: true,
    type: 'string'
  },
  email: 'string',
  createdAt: 'string',
  updatedAt: 'string',
  isNotificationsEnabled: 'boolean'
});

const expectEntity = (user, etaloneFields = {}) => {
  schema.validate(user);
  schema.checkEquals(user, etaloneFields);
};

const expectEntityUpdated = (user, newData) => {
  expectEntity(user, newData);
};

// check access token of user is not outdated
const expectAccessTokenIsValid = (token, done) => {
  all.expectTokenIsValid('/api/v1/auth/check-access', token, done);
};
// check refresh token of user is not outdated
const expectRefreshTokenIsValid = (token, done) => {
  all.expectTokenIsValid('/api/v1/auth/check-refresh', token, done);
};

module.exports = {
  expectEntityUpdated,
  expectEntity,
  expectAccessTokenIsValid,
  expectRefreshTokenIsValid
};
