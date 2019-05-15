const { BasicStrategy } = require('passport-http');

function createStrategy({ getByCredentials, wrapUser }) {
  return new BasicStrategy((username, password, next) => getByCredentials(username, password)
    .then((user) => {
      if (user) {
        next(null, wrapUser(user));
      } else {
        next(undefined, false, { message: 'No such user' });
      }
    })
    .catch(() => next(null, false)));
}

module.exports = {
  createStrategy
};
