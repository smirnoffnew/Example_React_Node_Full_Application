const httpStatus = require('http-status');
const chai = require('chai');
const reqs = require('../../tests/reqs/index');
const expects = require('../../tests/expects/index');
const mongoose = require('mongoose');
const { getBusinessUserData } = require('../../tests/validData');
const testTools = require('../../tests/tools/index');
const config = require('../../../config/index');

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
    data: getBusinessUserData(),
    account: null,
    access: null,
    refresh: null
  }
};

describe('## Business auth APIs', () => {
  before('clean DB', testTools.cleanup);
  after('clean DB', testTools.cleanup);
  before('create user', (done) => {
    reqs.businessUser
      .create(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        done();
      })
      .catch(done);
  });
  describe('# POST /api/v1/auth/business-users/login', testLogin);
  describe('# GET /api/v1/auth/business-users/login', testGetInfo);
  describe('# GET /api/v1/auth/business-users/token', testUpdateAccessToken);
  describe('# POST /api/v1/auth/business-users/check-access', testCheckAccessToken);
  describe('# POST /api/v1/auth/business-users/check-refresh', testCheckRefreshToken);
  describe('# POST /api/v1/auth/business-users/password-reset', testPasswordResetInit);
  describe('# PUT /api/v1/auth/business-users/password-reset', testPasswordResetFinal);
});

function testLogin() {
  it('should return valid user\'s info', (done) => {
    reqs.businessUser
      .login(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.businessUser.expectEntity(res.body.user, testTools.copyAccount(env.user.data));
        done();
      })
      .catch(done);
  });
  it('should return JWT tokens', (done) => {
    reqs.businessUser
      .login(env.user.data)
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
  it('should not fail, verify refresh token', (done) => {
    reqs.businessUser
      .login(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.businessUser.expectRefreshTokenIsValid(res.body.tokens.refresh.token, done);
      })
      .catch(done);
  });
  it('should not fail, verify refresh token', (done) => {
    reqs.businessUser
      .login(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.businessUser.expectRefreshTokenIsValid(res.body.tokens.refresh.token, done);
      })
      .catch(done);
  });
  it('should return 401, no such user', (done) => {
    reqs.businessUser
      .login({
        ...env.user.data,
        password: 'aaaaWer$ty124'
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
}

function testGetInfo() {
  beforeEach((done) => {
    reqs.businessUser
      .login(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  it('should return valid user info', (done) => {
    reqs.businessUser
      .getInfo(env.user.access)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.businessUser.expectEntity(res.body, testTools.copyAccount(env.user.data));
        done();
      })
      .catch(done);
  });
  it('should reject 401, use invalid token', (done) => {
    reqs.businessUser
      .getInfo('this.is.not.a.token')
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.UNAUTHORIZED);
        done();
      })
      .catch(done);
  });
  it('should reject 401, use outdated token', (done) => {
    setTimeout(() => {
      reqs.businessUser
        .getInfo(env.user.access)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    }, env.user.accessExpiredIn - new Date().getTime());
  });
}

function testUpdateAccessToken() {
  beforeEach('login user', (done) => {
    reqs.businessUser
      .login(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  it('should return valid JWT token', (done) => {
    reqs.businessUser
      .updateToken(env.user.refresh)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.expectAccessJWTToken(res.body);
        expects.businessUser.expectAccessTokenIsValid(res.body.token, done);
      })
      .catch(done);
  });
  it('should fail, use outdated token', (done) => {
    setTimeout(() => {
      reqs.businessUser
        .updateToken(env.user.refresh)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    }, env.user.refreshExpiredIn - new Date().getTime());
  });
  it('should reject, used invalid token', (done) => {
    reqs.businessUser
      .updateToken('bearer not-a-token-at-all')
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.UNAUTHORIZED);
        done();
      })
      .catch(done);
  });
}

function testCheckAccessToken() {
  beforeEach('login user', (done) => {
    reqs.businessUser
      .login(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  it('should not reject, used valid token', (done) => {
    reqs.businessUser
      .checkAccessToken(env.user.access)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        done();
      })
      .catch(done);
  });
  it('should reject, used invalid token', (done) => {
    reqs.businessUser
      .checkAccessToken('invalid')
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.UNAUTHORIZED);
        done();
      })
      .catch(done);
  });
  it('should reject, used outdated token', (done) => {
    setTimeout(() => {
      reqs.businessUser
        .checkAccessToken(env.user.access)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    }, env.user.accessExpiredIn - new Date().getTime());
  });
}

function testCheckRefreshToken() {
  beforeEach('login user', (done) => {
    reqs.businessUser
      .login(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        testTools.parseAuthBody(res.body, env.user);
        done();
      })
      .catch(done);
  });
  it('should not reject, used valid token', (done) => {
    reqs.businessUser
      .checkRefreshToken(env.user.refresh)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        done();
      })
      .catch(done);
  });
  it('should reject, used invalid token', (done) => {
    reqs.businessUser
      .checkRefreshToken('invalid')
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.UNAUTHORIZED);
        done();
      })
      .catch(done);
  });
  it('should reject, used outdated token', (done) => {
    setTimeout(() => {
      reqs.businessUser
        .checkRefreshToken(env.user.refresh)
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done);
    }, env.user.refreshExpiredIn - new Date().getTime());
  });
}

function testPasswordResetInit() {
  afterEach('clean DB', testTools.cleanup);
  before('clean DB', testTools.cleanup);
  beforeEach('create user', (done) => {
    reqs.businessUser
      .create(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        done();
      })
      .catch(done);
  });
  it('should return 200 ( valid email )', (done) => {
    reqs.businessUser
      .resetPasswordInit(env.user.data.email)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expect(res.body.status)
          .to
          .be
          .eq('OK');
        done();
      })
      .catch(done);
  });
  it('should return 404 ( no user with such email )', (done) => {
    reqs.businessUser
      .resetPasswordInit('some.other@mail.com')
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
      .resetPasswordInit('invalid')
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.BAD_REQUEST);
        done();
      })
      .catch(done);
  });
  it('should return 400 ( do not wait for timeout, before make request again )', (done) => {
    reqs.businessUser
      .resetPasswordInit(env.user.data.email)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        return reqs.businessUser.resetPasswordInit(env.user.data.email);
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
  it('should return 200 ( wait for timeout, before make request again )', (done) => {
    reqs.businessUser
      .resetPasswordInit(env.user.data.email)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        setTimeout(
          () => reqs.businessUser
            .resetPasswordInit(env.user.data.email)
            .then((innerRes) => {
              expect(innerRes.status)
                .to
                .be
                .eq(httpStatus.OK);
              done();
            })
            .catch(done),
          config.auth.passwordResetTimeout + 100
        );
      })
      .catch(done);
  });
}

function testPasswordResetFinal() {
  let passwordResetJWT = null;
  afterEach('clean DB', testTools.cleanup);
  before('clean DB', testTools.cleanup);
  beforeEach('create user', (done) => {
    reqs.businessUser
      .create(env.user.data)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        done();
      })
      .catch(done);
  });
  beforeEach('init password reset process', (done) => {
    reqs.businessUser
      .resetPasswordInit(env.user.data.email)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expect(res.body.status)
          .to
          .be
          .eq('OK');
        passwordResetJWT = res.body.token;
        done();
      })
      .catch(done);
  });
  it('should return 200 ( valid token & password )', (done) => {
    reqs.businessUser
      .resetPassword({
        password: 'newPassword2!@',
        token: passwordResetJWT
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expect(res.body.status)
          .to
          .be
          .eq('OK');
        done();
      })
      .catch(done);
  });
  it('should reject all old tokens after password reset', (done) => {
    reqs.businessUser
      .resetPassword({
        password: 'newPassword2!@',
        token: passwordResetJWT
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expect(res.body.status)
          .to
          .be
          .eq('OK');
        return expects.expectTokenIsInvalid('/api/v1/auth/business-users/check-access', env.user.access, done);
      })
      .catch(done);
  });
  it('should not authenticate when use old password', (done) => {
    reqs.businessUser
      .resetPassword({
        password: 'newPassword2!@',
        token: passwordResetJWT
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        return reqs.businessUser.login(env.user.data);
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
  it('should return 400 ( invalid password & valid token )', (done) => {
    reqs.businessUser
      .resetPassword({
        password: 'sda',
        token: passwordResetJWT
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
  it('should return 401 ( use outdated token )', (done) => {
    setTimeout(
      () => reqs.businessUser
        .resetPassword({
          password: 'sdlk23ca@cKPs',
          token: passwordResetJWT
        })
        .then((res) => {
          expect(res.status)
            .to
            .be
            .eq(httpStatus.UNAUTHORIZED);
          done();
        })
        .catch(done),
      config.auth.jwtExpPasswordReset + 100
    );
  });
  it('should return 401 ( invalid token )', (done) => {
    reqs.businessUser
      .resetPassword({
        password: 'sd23knca@cKPs',
        token: 'passwordResetJWT'
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
}
