const httpStatus = require('http-status');
const user = require('./user');
const businessUser = require('./businessUser');
const category = require('./category');
const offer = require('./offer');
const business = require('./business');

const defaultTestsForQueries = [
  {
    query: {},
    expectedCode: httpStatus.OK
  },
  {
    query: {
      skip: 2
    },
    expectedCode: httpStatus.OK
  },
  {
    query: {
      skip: -3
    },
    expectedCode: httpStatus.BAD_REQUEST
  },
  {
    query: {
      skip: 100
    },
    expectedCode: httpStatus.OK
  },
  {
    query: {
      skip: 'not-a-number'
    },
    expectedCode: httpStatus.BAD_REQUEST
  },
  {
    query: {
      limit: 2
    },
    expectedCode: httpStatus.OK
  },
  {
    query: {
      limit: -2
    },
    expectedCode: httpStatus.BAD_REQUEST
  },
  {
    query: {
      limit: 'not-a-number'
    },
    expectedCode: httpStatus.BAD_REQUEST
  },
  {
    query: {
      limit: 0
    },
    expectedCode: httpStatus.BAD_REQUEST
  },
  {
    query: {
      limit: 200
    },
    expectedCode: httpStatus.BAD_REQUEST
  },
  {
    query: {
      skip: 0,
      limit: 2
    },
    expectedCode: httpStatus.OK
  },
  {
    query: {
      skip: -1,
      limit: 50
    },
    expectedCode: httpStatus.BAD_REQUEST
  },
  {
    query: {
      skip: 0,
      limit: -2
    },
    expectedCode: httpStatus.BAD_REQUEST
  },
  {
    query: {
      skip: -3,
      limit: 0
    },
    expectedCode: httpStatus.BAD_REQUEST
  }
];

module.exports = {
  offer,
  business,
  category,
  businessUser,
  user,
  defaultTestsForQueries
};
