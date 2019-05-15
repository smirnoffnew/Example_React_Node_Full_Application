const redis = require('../../services/redis')
  .getClient();
const config = require('../../../config/index');
const debug = require('debug')('app:user:redis');

function getCollectionForPasswordResetSecret(userId) {
  return `users.${userId}.resetPasswordSecret`;
}

function isPasswordResetSecretExpired(userId) {
  const collectionName = getCollectionForPasswordResetSecret(userId);
  debug('CHECK IS EXIST password reset secret of user %s', userId);
  return redis
    .ttlAsync(collectionName)
    .catch((err) => {
      debug(err);
      throw err;
    })
    .then(
      // eslint-disable-next-line
      v => v <= Math.floor((config.auth.jwtExpPasswordReset - config.auth.passwordResetTimeout) / 1000)
    );
}

function addPasswordResetToken(userId, secret) {
  const collectionName = getCollectionForPasswordResetSecret(userId);
  debug('ADD password reset secret of user %s', userId);
  return redis
    .setAsync(collectionName, secret)
    .then(() => redis.expireAsync(collectionName, config.auth.jwtExpPasswordReset / 1000))
    .catch((err) => {
      debug(err);
      throw err;
    });
}

function getPasswordResetToken(userId) {
  const collectionName = getCollectionForPasswordResetSecret(userId);
  debug('GET password reset secret of user %s', userId);
  return redis.getAsync(collectionName)
    .catch((err) => {
      debug(err);
      throw err;
    });
}

function delPasswordResetToken(userId) {
  const collectionName = getCollectionForPasswordResetSecret(userId);
  debug('DEL password reset secret of user %s', userId);
  return redis.delAsync(collectionName)
    .catch((err) => {
      debug(err);
      throw err;
    });
}

function getPasswordSecretTTL(userId) {
  const collectionName = getCollectionForPasswordResetSecret(userId);
  debug('GET TTL of password reset secret of user %s', userId);
  return redis.ttlAsync(collectionName)
    .catch((err) => {
      debug(err);
      throw err;
    });
}

module.exports = {
  getPasswordSecretTTL,
  isPasswordResetSecretExpired,
  addPasswordResetToken,
  getPasswordResetToken,
  delPasswordResetToken
};
