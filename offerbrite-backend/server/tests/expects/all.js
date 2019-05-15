const app = require('../../index');
const _ = require('lodash');
const flatten = require('flat');
const request = require('supertest');
const httpStatus = require('http-status');
const ValidationSchema = require('../../helpers/tests/ValidationSchema');
const chai = require('chai');

const { expect } = chai;
const addressSchema = new ValidationSchema({
  country: 'string',
  state: {
    type: 'string',
    optional: true
  },
  region: {
    type: 'string',
    optional: true
  },
  city: {
    type: 'string',
    optional: true
  },
  streetName: {
    type: 'string',
    optional: true
  },
  streetNumber: {
    type: 'string',
    optional: true
  },
});
const positionSchema = new ValidationSchema({
  latitude: {
    type: 'number',
    custom: v => expect(v)
      .to
      .be
      .within(-180, 180)
  },
  longitude: {
    type: 'number',
    custom: v => expect(v)
      .to
      .be
      .within(-180, 180)
  },

});
const locationSchema = new ValidationSchema({
  position: {
    type: positionSchema,
    optional: true
  },
  address: {
    type: addressSchema,
    optional: true
  }
});
const jwtToken = new ValidationSchema({
  token: 'string',
  expiredIn: {
    type: 'number',
    custom: v => expect(v)
      .to
      .be
      .least(new Date().getTime())
  }
});

// try to connect to server using JWT token
const expectTokenIsInvalid = (url, token, done) => {
  request(app)
    .get(url)
    .set('Authorization', `bearer ${token}`)
    .expect(httpStatus.UNAUTHORIZED)
    .then(() => {
      done();
    })
    .catch(done);
};
const expectAccessJWTToken = token => jwtToken.validate(token);
const expectRefreshJWTToken = token => jwtToken.validate(token);
// try to connect to server using JWT token
const expectTokenIsValid = (url, token, done) => {
  request(app)
    .get(url)
    .set('Authorization', `bearer ${token}`)
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(httpStatus.OK);
      done();
    })
    .catch(done);
};
const expectObjectUpdated = (obj, eta) => {
  _.forIn(flatten(eta), (path) => {
    expect(_.get(obj, path))
      .to
      .be
      .eq(_.get(eta, path));
  });
};
const expectPaginatedBody = ({
                               body, testForItems, skip = 0, limit = 50, total, query = {}
                             }) => {
  expect(body)
    .to
    .be
    .an('object');
  expect(body)
    .to
    .have
    .all
    .keys('docs', 'total', 'limit', 'offset');
  expect(body.docs)
    .to
    .have
    .length
    .of
    .at
    .most(query.limit || limit);
  if (total) {
    expect(body.total)
      .to
      .be
      .eq(total);
  }
  if (limit) {
    expect(body.limit)
      .to
      .be
      .of
      .at
      .most(query.limit || limit);
  }
  expect(body.offset)
    .to
    .of
    .eq(query.skip || skip);
  body.docs.forEach(d => testForItems(d));
};
const expectAuthTokens = (tokens) => {
  expect(tokens)
    .to
    .be
    .an('object');
  expect(tokens)
    .have
    .all
    .keys(['access', 'refresh']);
  expectAccessJWTToken(tokens.access);
  expectRefreshJWTToken(tokens.refresh);
};
const expectLocation = obj => locationSchema.validate(obj);
module.exports = {
  expectLocation,
  expectAuthTokens,
  expectTokenIsInvalid,
  expectAccessJWTToken,
  expectRefreshJWTToken,
  expectTokenIsValid,
  expectObjectUpdated,
  expectPaginatedBody
};
