const dbFiller = require('../../helpers/dbFiller');
const _ = require('lodash');

/* eslint-disable-next-line consistent-return */
function cleanup(done) {
  if (done) {
    dbFiller
      .clearAllDBs()
      .then(() => done())
      .catch(done);
  } else {
    return dbFiller.clear();
  }
}

function parseAuthBody(body, auth = {}) {
  auth.account = body.user;
  auth.access = body.tokens.access.token;
  auth.refresh = body.tokens.refresh.token;
  auth.refreshExpiredIn = body.tokens.refresh.expiredIn;
  auth.accessExpiredIn = body.tokens.access.expiredIn;
  return auth;
}

const runTestCases = ({ testData, makeReq }) => {
  Object.keys(testData)
    .forEach((param) => {
      describe(`Bad ${param}`, () => {
        testData[param].forEach((tc) => {
          it(`should return ${tc.expectedCode}, ( ${tc.description} )`, (done) => {
            makeReq({
              ...tc,
              data: _.isFunction(tc.data) ? tc.data() : tc.data
            }, done)
              .catch(done);
          });
        });
      });
    });
};

function compile(data) {
  return _.toPairs(data)
    .reduce((result, pair) => {
      if (_.isFunction(pair[1])) {
        result[pair[0]] = pair[1]();
      } else if (_.isObject(pair[1])) {
        result[pair[0]] = compile(pair[1]);
      } else {
        result[pair[0]] = pair[1];
      }
      return result;
    }, {});
}

function copyAccount(user) {
  const copy = Object.assign({}, user);
  delete copy.updatedAt;
  delete copy.password;
  return copy;
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = {
  copyAccount,
  runTestCases,
  compile,
  cleanup,
  parseAuthBody,
  getRandomNumber
};
