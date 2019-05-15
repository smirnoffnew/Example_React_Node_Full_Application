const { ExtractJwt, Strategy } = require('passport-jwt');

function createStrategy({ getByToken, secretOrKey, wrapUser }) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey
  };
  return new Strategy(opts, (jwtPayload, next) => getByToken(jwtPayload)
    .then((user) => {
      if (user) {
        return next(null, wrapUser(user));
      }
      return next(null, false);
    })
    .catch(() => next(null, false)));
}

module.exports = {
  createStrategy
};
