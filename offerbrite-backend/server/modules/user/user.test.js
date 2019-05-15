const httpStatus = require('http-status');
const chai = require('chai');
const reqs = require('../../tests/reqs/index');
const expects = require('../../tests/expects/index');
const mongoose = require('mongoose');
const { getUserData } = require('../../tests/validData');
const testTools = require('../../tests/tools/index');
const testQueries = require('../../tests/queries/index');
const config = require('../../../config/index');
const User = require('./user.model');

const ObjectId = mongoose.Types.ObjectId;
const expect = chai.expect;
chai.config.includeStack = true;

after((done) => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

const env = {
  user: {
    data: getUserData(),
    account: null,
    access: null,
    refresh: null
  }
};

describe('## User APIs', () => {
  before('clean DB', testTools.cleanup);
  after('clean DB', testTools.cleanup);
  describe('# POST /api/v1/users', testUserCreation);
  describe('# PUT /api/v1/users/:id', testUserUpdate);
  describe('# PUT /api/v1/users/:id/password', testUserUpdatePassword);
  describe('# PUT /api/v1/users/:id/email', testUserUpdateEmail);
  describe('# GET /api/v1/users/:id', testUserGetById);
  describe('# DELETE /api/v1/users/:id', testUserDelete);
  describe('# POST /api/v1/users/admin', testAdminInit);
});

function testUserCreation() {
  afterEach('clean DB', testTools.cleanup);
  describe('valid data', () => {
    it('should create a new user (valid info) ', (done) => {
      reqs.user
        .create(env.user.data)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.user.expectEntity(res.body.user, testTools.copyAccount(env.user.data));
          done();
        })
        .catch(done);
    });
    it('should return 400, ( used email ) ', (done) => {
      reqs.user
        .create(env.user.data)
        .then(() => reqs.user.create(env.user.data))
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.BAD_REQUEST);
          done();
        })
        .catch(done);
    });
    it('should return JWT tokens', (done) => {
      reqs.user
        .create(env.user.data)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.expectAuthTokens(res.body.tokens);
          done();
        })
        .catch(done);
    });
    it('should not fail, verify access token', (done) => {
      reqs.user
        .create(env.user.data)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.user.expectAccessTokenIsValid(res.body.tokens.access.token, done);
        })
        .catch(done);
    });
    it('should not fail, verify refresh token', (done) => {
      reqs.user
        .create(env.user.data)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.user.expectRefreshTokenIsValid(res.body.tokens.refresh.token, done);
        })
        .catch(done);
    });
  });
  const runTestCaseCreation = (testCase, done) => reqs.user
    .create({
      ...env.user.data,
      ...testCase.data
    })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(testCase.expectedCode);
      done();
    });
  testTools.runTestCases({
    testData: testQueries.user.testSuitsForUserCreation,
    makeReq: runTestCaseCreation
  });
}

function testUserUpdate() {
  beforeEach('login or create user', (done) => {
    reqs.user
      .createOrLogin(env.user.data)
      .then((res) => {
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  afterEach('clean DB', testTools.cleanup);
  describe('invalid id', () => {
    it('should return 404 ( new id )', (done) => {
      reqs.user
        .update({
          userId: ObjectId(),
          accessToken: env.user.access
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.NOT_FOUND);
          done();
        })
        .catch(done);
    });
    it('should return 400 ( invalid id )', (done) => {
      reqs.user
        .update({
          userId: 'not-an-id',
          accessToken: env.user.access
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.BAD_REQUEST);
          done();
        })
        .catch(done);
    });
  });
  describe('invalid token', () => {
    it('should return 401 ( bad token )', (done) => {
      reqs.user
        .update({
          userId: env.user.account.id,
          accessToken: 'Asd'
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    });
    it('should return 401 ( no auth )', (done) => {
      reqs.user
        .update({ userId: env.user.account.id })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    });
    it('should return 403 ( user is not an owner of account )', (done) => {
      reqs.user
        .create({
          ...getUserData(),
          email: 'newUser@gmail.com'
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          return reqs.user.update({
            userId: env.user.account.id,
            accessToken: res.body.tokens.access.token
          });
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.FORBIDDEN);
          done();
        })
        .catch(done);
    });
  });
  describe('test each property', () => {
    const runTestCaseUpdate = (tc, done) => reqs.user
      .update({
        userId: env.user.account.id,
        data: tc.data,
        accessToken: env.user.access
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(tc.expectedCode);
        if (tc.expectedCode === httpStatus.OK) {
          expects.user.expectEntityUpdated(res.body, tc.expectedData || tc.data);
        }
        done();
      });
    testTools.runTestCases({
      testData: testQueries.user.testSuitsForUserUpdating,
      makeReq: runTestCaseUpdate
    });
  });
}

function testUserGetById() {
  before('login or create user', (done) => {
    reqs.user
      .create(env.user.data)
      .then((res) => {
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  after('clean DB', testTools.cleanup);
  it('should return user (valid id & token) ', (done) => {
    reqs.user
      .getById({
        userId: env.user.account.id,
        accessToken: env.user.access
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.user.expectEntity(res.body, testTools.copyAccount(env.user.data));
        done();
      })
      .catch(done);
  });
  describe('invalid id', () => {
    it('should return 404 ( new id )', (done) => {
      reqs.user
        .getById({
          userId: ObjectId(),
          accessToken: env.user.access
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.NOT_FOUND);
          done();
        })
        .catch(done);
    });
    it('should return 400 ( invalid id )', (done) => {
      reqs.user
        .getById({
          userId: 'not-an-id',
          accessToken: env.user.access
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.BAD_REQUEST);
          done();
        })
        .catch(done);
    });
  });
  describe('invalid token', () => {
    it('should return 401 ( bad token )', (done) => {
      reqs.user
        .getById({
          userId: env.user.account.id,
          accessToken: 'Asd'
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    });
    it('should return 401 ( no auth )', (done) => {
      reqs.user
        .getById({ userId: env.user.account.id })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    });

    it('should return 200 ( user is not an owner of account )', (done) => {
      reqs.user
        .create({
          ...getUserData(),
          email: 'newUser@gmail.com'
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          return reqs.user.getById({
            userId: env.user.account.id,
            accessToken: res.body.tokens.access.token
          });
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          done();
        })
        .catch(done);
    });
  });
}

function testUserDelete() {
  beforeEach('login or create user', (done) => {
    reqs.user
      .createOrLogin(env.user.data)
      .then((res) => {
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  after('clean DB', testTools.cleanup);
  it('should return 200 and deleted user (valid id & auth)', (done) => {
    reqs.user
      .delete({ userId: env.user.account.id, ...env.user.data })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.user.expectEntity(res.body, testTools.copyAccount(env.user.data));
        done();
      })
      .catch(done);
  });
  it('should return 404 on getById after deleting', (done) => {
    reqs.user
      .delete({ userId: env.user.account.id, ...env.user.data })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        return reqs.user.getById({
          userId: env.user.account.id,
          accessToken: env.user.access
        });
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.NOT_FOUND);
        done();
      })
      .catch(done);
  });
  describe('invalid id', () => {
    it('should return 404 ( new id )', (done) => {
      reqs.user
        .delete({ userId: ObjectId(), ...env.user.data })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.NOT_FOUND);
          done();
        })
        .catch(done);
    });
    it('should return 400 ( invalid email )', (done) => {
      reqs.user
        .delete({ userId: 'not-an-id', ...env.user.data })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.BAD_REQUEST);
          done();
        })
        .catch(done);
    });
  });
  describe('invalid credentials', () => {
    it('should return 401 ( bad email )', (done) => {
      reqs.user
        .delete({
          userId: env.user.account.id,
          ...env.user.data,
          email: 'another.mail@mail.com'
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    });
    it('should return 401 ( use access token instead of email & password )', (done) => {
      reqs.user
        .delete({
          userId: env.user.account.id,
          accessToken: env.user.access
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    });
    it('should return 401 ( bad password )', (done) => {
      reqs.user
        .delete({
          userId: env.user.account.id,
          ...env.user.data,
          password: 'invalid'
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    });
    it('should return 401 ( no auth )', (done) => {
      reqs.user
        .delete({ userId: env.user.account.id })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    });

    it('should return 403 ( user is not an owner of account )', (done) => {
      reqs.user
        .create({
          ...env.user.data,
          email: 'new.mail@mail.com'
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          return reqs.user.delete({
            userId: res.body.user.id,
            ...env.user.data
          });
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.FORBIDDEN);
          done();
        })
        .catch(done);
    });
  });
}

function testUserUpdateEmail() {
  beforeEach('login or create user', (done) => {
    reqs.user
      .createOrLogin(env.user.data)
      .then((res) => {
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  afterEach('clean DB', testTools.cleanup);
  it('should return 400, ( used email ) ', (done) => {
    const newEmail = getUserData().email;
    reqs.user
      .create({
        ...getUserData(),
        email: newEmail
      })
      .expect(httpStatus.OK)
      .then(() => reqs.user.updateEmail({
        userId: env.user.account.id,
        ...env.user.data,
        data: {
          email: newEmail
        }
      }))
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.BAD_REQUEST);
        done();
      })
      .catch(done);
  });
  const runTestCaseUpdateEmail = (tc, done) => reqs.user
    .updateEmail({
      userId: env.user.account.id,
      data: tc.data,
      ...env.user.data
    })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(tc.expectedCode);
      if (tc.expectedCode === httpStatus.OK) {
        expects.user.expectEntityUpdated(res.body, tc.data);
      }
      done();
    });
  testTools.runTestCases({
    testData: testQueries.user.testSuitsForUserEmail,
    makeReq: runTestCaseUpdateEmail
  });
}

function testUserUpdatePassword() {
  beforeEach('login or create user', (done) => {
    reqs.user
      .createOrLogin(env.user.data)
      .then((res) => {
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  afterEach('clean DB', testTools.cleanup);
  it('should reject all tokens after password updating', (done) => {
    reqs.user
      .updatePassword({
        userId: env.user.account.id,
        ...env.user.data,
        data: {
          password: 'newPassw@rd123'
        }
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.expectTokenIsInvalid('/api/v1/auth/check-access', env.user.access, done);
      })
      .catch(done);
  });
  const runTestCaseUpdatePassword = (tc, done) => reqs.user
    .updatePassword({
      userId: env.user.account.id,
      data: tc.data,
      ...env.user.data
    })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(tc.expectedCode);
      done();
    });
  testTools.runTestCases({
    testData: testQueries.user.testSuitsForUserPassword,
    makeReq: runTestCaseUpdatePassword
  });
}

function testAdminInit() {
  it('should return 200', (done) => {
    reqs.user.initAdmin()
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        return User.findOne({ email: config.auth.admin.email })
          .exec();
      })
      .then((doc) => {
        expect(doc)
          .to
          .be
          .an('object');
        done();
      })
      .catch(done);
  });
}
