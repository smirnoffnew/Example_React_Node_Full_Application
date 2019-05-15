const httpStatus = require('http-status');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const reqs = require('../../tests/reqs/index');
const expects = require('../../tests/expects/index');
const mongoose = require('mongoose');
const { getBusinessUserData, getBusinessData } = require('../../tests/validData');
const testTools = require('../../tests/tools/index');
const testQueries = require('../../tests/queries/index');

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
  businessUser: {
    data: getBusinessUserData(),
    account: null,
    access: null,
    refresh: null
  }
};

describe('## BusinessUser APIs', () => {
  before('clean DB', testTools.cleanup);
  after('clean DB', testTools.cleanup);
  describe('# POST /api/v1/business-users', testUserCreation);
  describe('# PUT /api/v1/business-users/:id', testUserUpdate);
  describe('# PUT /api/v1/business-users/:id/password', testUserUpdatePassword);
  describe('# PUT /api/v1/business-users/:id/email', testUserUpdateEmail);
  describe('# GET /api/v1/business-users/:id', testUserGetById);
  describe('# DELETE /api/v1/business-users/:id', testUserDelete);
});

function testUserCreation() {
  afterEach('clean DB', testTools.cleanup);
  describe('valid data', () => {
    it('should create a new user (valid info) ', (done) => {
      reqs.businessUser
        .create(env.businessUser.data)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.businessUser
            .expectEntity(res.body.user, testTools.copyAccount(env.businessUser.data));
          done();
        })
        .catch(done);
    });
    it('should return 400, ( used email ) ', (done) => {
      reqs.businessUser
        .create(env.businessUser.data)
        .then(() => reqs.businessUser.create(env.businessUser.data))
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
      reqs.businessUser
        .create(env.businessUser.data)
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
      reqs.businessUser
        .create(env.businessUser.data)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.businessUser.expectAccessTokenIsValid(res.body.tokens.access.token, done);
        })
        .catch(done);
    });
    it('should not fail, verify refresh token', (done) => {
      reqs.businessUser
        .create(env.businessUser.data)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          expects.businessUser.expectRefreshTokenIsValid(res.body.tokens.refresh.token, done);
        })
        .catch(done);
    });
  });
  const runTestCaseCreation = (testCase, done) => reqs.businessUser
    .create({
      ...env.businessUser.data,
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
    testData: testQueries.businessUser.testSuitsForUserCreation,
    makeReq: runTestCaseCreation
  });
}

function testUserUpdate() {
  beforeEach('login or create user', (done) => {
    reqs.businessUser
      .createOrLogin(env.businessUser.data)
      .then((res) => {
        testTools.parseAuthBody(res.body, env.businessUser);
        done();
      })
      .catch(done);
  });
  afterEach('clean DB', testTools.cleanup);
  describe('invalid id', () => {
    it('should return 404 ( new id )', (done) => {
      reqs.businessUser
        .update({
          userId: ObjectId(),
          accessToken: env.businessUser.access
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
      reqs.businessUser
        .update({
          userId: 'not-an-id',
          accessToken: env.businessUser.access
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
      reqs.businessUser
        .update({
          userId: env.businessUser.account.id,
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
      reqs.businessUser
        .update({ userId: env.businessUser.account.id })
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
      reqs.businessUser
        .create({
          ...getBusinessUserData(),
          email: 'newUser@gmail.com'
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          return reqs.businessUser.update({
            userId: env.businessUser.account.id,
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
    const runTestCaseUpdate = (tc, done) => reqs.businessUser
      .update({
        userId: env.businessUser.account.id,
        data: tc.data,
        accessToken: env.businessUser.access
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(tc.expectedCode);
        if (tc.expectedCode === httpStatus.OK) {
          expects.businessUser.expectEntityUpdated(res.body, tc.data);
        }
        done();
      });
    testTools.runTestCases({
      testData: testQueries.businessUser.testSuitsForUserUpdating,
      makeReq: runTestCaseUpdate
    });
  });
}

function testUserGetById() {
  before('login or create user', (done) => {
    reqs.businessUser
      .create(env.businessUser.data)
      .then((res) => {
        testTools.parseAuthBody(res.body, env.businessUser);
        done();
      })
      .catch(done);
  });
  after('clean DB', testTools.cleanup);
  it('should return user (valid id & token) ', (done) => {
    reqs.businessUser
      .getById({
        userId: env.businessUser.account.id,
        accessToken: env.businessUser.access
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.businessUser.expectEntity(res.body, testTools.copyAccount(env.businessUser.data));
        done();
      })
      .catch(done);
  });
  describe('invalid id', () => {
    it('should return 404 ( new id )', (done) => {
      reqs.businessUser
        .getById({
          userId: ObjectId(),
          accessToken: env.businessUser.access
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
      reqs.businessUser
        .getById({
          userId: 'not-an-id',
          accessToken: env.businessUser.access
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
      reqs.businessUser
        .getById({
          userId: env.businessUser.account.id,
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
      reqs.businessUser
        .getById({ userId: env.businessUser.account.id })
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
      reqs.businessUser
        .create({
          ...getBusinessUserData(),
          email: 'newUser@gmail.com'
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          return reqs.businessUser.getById({
            userId: env.businessUser.account.id,
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
    reqs.businessUser
      .createOrLogin(env.businessUser.data)
      .then((res) => {
        testTools.parseAuthBody(res.body, env.businessUser);
        done();
      })
      .catch(done);
  });
  after('clean DB', testTools.cleanup);
  it('should return 200 and deleted user (valid id & auth)', (done) => {
    reqs.businessUser
      .delete({ userId: env.businessUser.account.id, ...env.businessUser.data })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.businessUser.expectEntity(res.body, testTools.copyAccount(env.businessUser.data));
        done();
      })
      .catch(done);
  });
  it('should deleted all businesses of user (valid id & auth)', (done) => {
    reqs.business.create({
      accessToken: env.businessUser.access,
      data: getBusinessData()
    })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        return reqs.businessUser
          .delete({ userId: env.businessUser.account.id, ...env.businessUser.data });
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        return reqs.business.list({ query: { ownerId: env.businessUser.id } });
      })
      .then((res) => {
        expect(res.body.total)
          .to
          .be
          .eq(0);
        done();
      })
      .catch(done);
  });
  it('should return 404 on getById after deleting', (done) => {
    reqs.businessUser
      .delete({ userId: env.businessUser.account.id, ...env.businessUser.data })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        return reqs.businessUser.getById({
          userId: env.businessUser.account.id,
          accessToken: env.businessUser.access
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
      reqs.businessUser
        .delete({ userId: ObjectId(), ...env.businessUser.data })
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
      reqs.businessUser
        .delete({ userId: 'not-an-id', ...env.businessUser.data })
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
      reqs.businessUser
        .delete({
          userId: env.businessUser.account.id,
          ...env.businessUser.data,
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
      reqs.businessUser
        .delete({
          userId: env.businessUser.account.id,
          accessToken: env.businessUser.access
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
      reqs.businessUser
        .delete({
          userId: env.businessUser.account.id,
          ...env.businessUser.data,
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
      reqs.businessUser
        .delete({ userId: env.businessUser.account.id })
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
      reqs.businessUser
        .create({
          ...env.businessUser.data,
          email: 'new.mail@mail.com'
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.OK);
          return reqs.businessUser.delete({
            userId: res.body.user.id,
            ...env.businessUser.data
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
    reqs.businessUser
      .createOrLogin(env.businessUser.data)
      .then((res) => {
        testTools.parseAuthBody(res.body, env.businessUser);
        done();
      })
      .catch(done);
  });
  afterEach('clean DB', testTools.cleanup);
  it('should return 400, ( used email ) ', (done) => {
    const newEmail = getBusinessUserData().email;
    reqs.businessUser
      .create({
        ...getBusinessUserData(),
        email: newEmail
      })
      .expect(httpStatus.OK)
      .then(() => reqs.businessUser.updateEmail({
        userId: env.businessUser.account.id,
        ...env.businessUser.data,
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
  const runTestCaseUpdateEmail = (tc, done) => reqs.businessUser
    .updateEmail({
      userId: env.businessUser.account.id,
      data: tc.data,
      ...env.businessUser.data
    })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(tc.expectedCode);
      if (tc.expectedCode === httpStatus.OK) {
        expects.businessUser.expectEntityUpdated(res.body, tc.data);
      }
      done();
    });
  testTools.runTestCases({
    testData: testQueries.businessUser.testSuitsForUserEmail,
    makeReq: runTestCaseUpdateEmail
  });
}

function testUserUpdatePassword() {
  beforeEach('login or create user', (done) => {
    reqs.businessUser
      .createOrLogin(env.businessUser.data)
      .then((res) => {
        testTools.parseAuthBody(res.body, env.businessUser);
        done();
      })
      .catch(done);
  });
  afterEach('clean DB', testTools.cleanup);
  it('should reject all tokens after password updating', (done) => {
    reqs.businessUser
      .updatePassword({
        userId: env.businessUser.account.id,
        ...env.businessUser.data,
        data: {
          password: 'newPassw@rd123'
        }
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.expectTokenIsInvalid('/api/v1/auth/check-access', env.businessUser.access, done);
      })
      .catch(done);
  });
  const runTestCaseUpdatePassword = (tc, done) => reqs.businessUser
    .updatePassword({
      userId: env.businessUser.account.id,
      data: tc.data,
      ...env.businessUser.data
    })
    .then((res) => {
      expect(res.status)
        .to
        .be
        .eq(tc.expectedCode);
      done();
    });
  testTools.runTestCases({
    testData: testQueries.businessUser.testSuitsForUserPassword,
    makeReq: runTestCaseUpdatePassword
  });
}
