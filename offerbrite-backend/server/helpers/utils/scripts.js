const User = require('../../modules/user/user.model');
const config = require('../../../config');
const log = require('../winston')
  .getLogger({ name: 'scripts' });
const Category = require('../../modules/category/category.model');
const fse = require('fs-extra');
const jwt = require('jsonwebtoken');

const createAdmin = () => new User({
  email: 'admin@email.com',
  password: 'admin',
  username: 'admin',
  role: 'admin'
}).save();

const initAdminUserCreation = () => User.findOne({ username: 'admin' })
  .then((doc) => {
    if (doc === null) {
      return createAdmin();
    }
    return null;
  })
  .then((doc) => {
    if (doc) {
      log.info('admin created');
      return null;
    }
      log.info('admin user exist');
  });

const initPredefinedCategories = () => {
  Category.find()
    .countDocuments()
    .exec()
    .then((count) => {
      if (count > 0) {
        log.info('DB contains %s categories, so do not fill DB with pre defined categories', count);
      } else {
        fse.readJSON(config.resources.predefinedCategories)
          .then(cats => Promise.all(cats.map(cat => new Category(cat).save())))
          .then((savedDocs) => {
            log.info('fill DB with %s categories', savedDocs.length);
          });
      }
    })
    .catch((err) => {
      log.error(err);
    });
};

const getAdminUser = data => User.findOne({ username: data.body.name })
  .then((res) => {
    if (res == null) {
      return false;
    }
      return genAuthTokens(res);
  });

function genAuthTokens(data) {
  return {
    access: genJWTAccessToken(data),
    refresh: genJWTRefreshToken(data)
  };
}

// Generate access token
function genJWTRefreshToken(data) {
  return {
    expiredIn: config.auth.jwtExpRefresh + new Date().getTime(),
    token: jwt.sign({
      id: data.id,
      secret: data.jwtSecret
    }, config.auth.jwtSecretRefreshUser, {
      expiresIn: Math.floor(config.auth.jwtExpRefresh / 1000)
    })
  };
}

// Generate refresh token
function genJWTAccessToken(data) {
  return {
    expiredIn: config.auth.jwtExpAccess + new Date().getTime(),
    token: jwt.sign({
      id: data.id,
      secret: data.jwtSecret
    }, config.auth.jwtSecretAccessUser, {
      expiresIn: Math.floor(config.auth.jwtExpAccess / 1000)
    })
  };
}

const onStart = () => {
  initAdminUserCreation();
  initPredefinedCategories();
};

module.exports = {
  getAdminUser,
  onStart,
  initAdminUserCreation
};
