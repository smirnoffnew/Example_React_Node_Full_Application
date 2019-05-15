const httpStatus = require('http-status');
const chai = require('chai');
const reqs = require('../../tests/reqs/index');
const expects = require('../../tests/expects/index');
const mongoose = require('mongoose');
const { getUserData } = require('../../tests/validData');
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
    data: getUserData(),
    account: null,
    access: null,
    refresh: null
  }
};

describe('## Auth APIs', () => {
  before('clean DB', testTools.cleanup);
  after('clean DB', testTools.cleanup);
  before('create user', (done) => {
    reqs.user
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
  describe('# POST /api/v1/auth/login', testLogin);
  describe('# GET /api/v1/auth/login', testGetInfo);
  describe('# GET /api/v1/auth/token', testUpdateAccessToken);
  describe('# POST /api/v1/auth/check-access', testCheckAccessToken);
  describe('# POST /api/v1/auth/check-refresh', testCheckRefreshToken);
  describe('# POST /api/v1/auth/password-reset', testPasswordResetInit);
  describe('# PUT /api/v1/auth/password-reset', testPasswordResetFinal);
});

function testLogin() {
  it('should return valid user\'s info', (done) => {
    reqs.user
      .login(env.user.data)
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
  it('should return JWT tokens', (done) => {
    reqs.user
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
    reqs.user
      .login(env.user.data)
      .then((res) => {
        expects.user.expectRefreshTokenIsValid(res.body.tokens.refresh.token, done);
      })
      .catch(done);
  });
  it('should not fail, verify refresh token', (done) => {
    reqs.user
      .login(env.user.data)
      .then((res) => {
        expects.user.expectRefreshTokenIsValid(res.body.tokens.refresh.token, done);
      })
      .catch(done);
  });
  it('should return 401, no such user', (done) => {
    reqs.user
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
    reqs.user
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
    reqs.user
      .getInfo(env.user.access)
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
  it('should reject 401, use invalid token', (done) => {
    reqs.user
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
      reqs.user
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
    reqs.user
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
    reqs.user
      .updateToken(env.user.refresh)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        expects.expectAccessJWTToken(res.body);
        expects.user.expectAccessTokenIsValid(res.body.token, done);
      })
      .catch(done);
  });
  it('should fail, use outdated token', (done) => {
    setTimeout(() => {
      reqs.user
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
    reqs.user
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
    reqs.user
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
    reqs.user
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
    reqs.user
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
      reqs.user
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
    reqs.user
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
    reqs.user
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
    reqs.user
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
      reqs.user
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
    reqs.user
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
    reqs.user
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
    reqs.user
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
    reqs.user
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
    reqs.user
      .resetPasswordInit(env.user.data.email)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        return reqs.user.resetPasswordInit(env.user.data.email);
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
    reqs.user
      .resetPasswordInit(env.user.data.email)
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        setTimeout(
          () => reqs.user
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
    reqs.user
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
    reqs.user
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
    reqs.user
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
    reqs.user
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
        return expects.expectTokenIsInvalid('/api/v1/auth/check-access', env.user.access, done);
      })
      .catch(done);
  });
  it('should not authenticate when use old password', (done) => {
    reqs.user
      .resetPassword({
        password: 'newPassword2!@',
        token: passwordResetJWT
      })
      .then((res) => {
        expect(res.status)
          .to
          .be
          .eq(httpStatus.OK);
        return reqs.user.login(env.user.data);
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
    reqs.user
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
      () => reqs.user
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
    reqs.user
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
