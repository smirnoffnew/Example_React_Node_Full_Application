const passport = require('passport');
const bearer = require('./bearer');
const basic = require('./basic');
const config = require('../../../config');
const User = require('../../modules/user/user.model');
const BusinessUser = require('../../modules/business-user/businessUser.model');
const APIError = require('../APIError');
const httpStatus = require('http-status');

/**
 * Wraps passport authenticate method and adds APIError support
 * @param {string|string[]} kind  - name of strategy to use
 */

function wrapUser(bindTo) {
  return user => ({
    bindTo,
    user
  });
}

function passportWrapper(strategy) {
  // eslint-disable-next-line max-len
  return (req, res, next) => passport.authenticate(strategy, { session: false }, (err, wrappedUser) => {
    if (err) {
      return next(err);
    }
    if (!wrappedUser) {
      return next(new APIError('Unauthorized', httpStatus.UNAUTHORIZED, false));
    }
    req[wrappedUser.bindTo] = wrappedUser.user;
    return next();
  })(req, res, next);
}

function init() {
  passport.use(
    'jwt.a.u',
    bearer.createStrategy({
      getByToken: payload => User.getByToken(payload),
      secretOrKey: config.auth.jwtSecretAccessUser,
      wrapUser: wrapUser('authUser')
    })
  );
  passport.use(
    'jwt.r.u',
    bearer.createStrategy({
      getByToken: payload => User.getByToken(payload),
      secretOrKey: config.auth.jwtSecretRefreshUser,
      wrapUser: wrapUser('authUser')
    })
  );
  passport.use(
    'basic.u',
    basic.createStrategy({
      getByCredentials: (email, password) => User.getByCredentials({
        email,
        password
      }),
      wrapUser: wrapUser('authUser')
    })
  );
  passport.use(
    'jwt.reset-password.u',
    bearer.createStrategy({
      getByToken: payload => User.getByResetPasswordToken(payload),
      secretOrKey: config.auth.jwtSecretPasswordReset,
      wrapUser: wrapUser('authUser')
    })
  );

  passport.use(
    'jwt.a.bu',
    bearer.createStrategy({
      getByToken: payload => BusinessUser.getByToken(payload),
      secretOrKey: config.auth.jwtSecretAccessBusinessUser,
      wrapUser: wrapUser('authUser')
    })
  );
  passport.use(
    'jwt.r.bu',
    bearer.createStrategy({
      getByToken: payload => BusinessUser.getByToken(payload),
      secretOrKey: config.auth.jwtSecretRefreshBusinessUser,
      wrapUser: wrapUser('authUser')
    })
  );
  passport.use(
    'basic.bu',
    basic.createStrategy({
      getByCredentials: (email, password) => BusinessUser.getByCredentials({
        email,
        password
      }),
      wrapUser: wrapUser('authUser')
    })
  );
  passport.use(
    'jwt.reset-password.bu',
    bearer.createStrategy({
      getByToken: payload => BusinessUser.getByResetPasswordToken(payload),
      secretOrKey: config.auth.jwtSecretPasswordResetBusinessUser,
      wrapUser: wrapUser('authUser')
    })
  );
  passport.use(
    'jwt.a.a',
    bearer.createStrategy({
      getByToken: payload => User.getByTokenAdmin(payload),
      secretOrKey: config.auth.jwtSecretAccessAdmin,
      wrapUser: wrapUser('authUser')
    })
  );
  passport.use(
    'jwt.r.a',
    bearer.createStrategy({
      getByToken: payload => User.getByTokenAdmin(payload),
      secretOrKey: config.auth.jwtSecretRefreshAdmin,
      wrapUser: wrapUser('authUser')
    })
  );
  passport.use(
    'basic.a',
    basic.createStrategy({
      getByCredentials: (email, password) => User.getByCredentialsAdmin({
        email,
        password
      }),
      wrapUser: wrapUser('authUser')
    })
  );
  return passport.initialize();
}


const jwtUserAccess = passportWrapper('jwt.a.u');
const jwtUserRefresh = passportWrapper('jwt.r.u');
const basicUser = passportWrapper('basic.u');
const jwtPasswordResetUser = passportWrapper('jwt.reset-password.u');

const jwtBusinessUserAccess = passportWrapper('jwt.a.bu');
const jwtBusinessUserRefresh = passportWrapper('jwt.r.bu');
const basicBusinessUser = passportWrapper('basic.bu');
const jwtPasswordResetBusinessUser = passportWrapper('jwt.reset-password.bu');

const jwtAdminAccess = passportWrapper('jwt.a.a');
const jwnAdminRefresh = passportWrapper('jwt.r.a');
const basicAdmin = passportWrapper('basic.a');

const jwtAnyAccess = passportWrapper(['jwt.a.u', 'jwt.a.bu']);

module.exports = {
  jwtAnyAccess,
  jwtBusinessUserAccess,
  jwtBusinessUserRefresh,
  jwtPasswordResetBusinessUser,
  basicBusinessUser,
  jwtPasswordResetUser,
  jwtUserAccess,
  jwtUserRefresh,
  basicUser,
  init,
  jwnAdminRefresh,
  jwtAdminAccess,
  basicAdmin
};
