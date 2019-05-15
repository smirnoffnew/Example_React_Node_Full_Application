/* eslint-disable no-useless-escape */
const Firebase = require('../../services/firebase')
  .getClient();
const validator = require('validator');

function UrlExtension(joi) {
  return {
    base: joi.string(),
    name: 'url',
    language: {
      notAnUrl: 'is not an URL',
      isNotUrlOfFileAtStore: 'this URL is not an URL of file, saved at our storage'
    },
    rules: [
      {
        name: 'isUrl',
        validate(params, value, state, options) {
          if (!value || (value.length && validator.isURL(value))) {
            return value;
          }
          return this.createError('url.notAnUrl', { value }, state, options);
        }
      },
      {
        name: 'isUrlOfFileAtStore',
        validate(params, value, state, options) {
          if (value && value.length > 0) {
            if (!validator.isURL(value)) {
              return this.createError('string.notAnUrl', { value }, state, options);
            }
            if (!Firebase.storage.isValidFileUrl(value)) {
              return this.createError('url.isNotUrlOfFileAtStore', { value }, state, options);
            }
          }
          return value;
        }
      }
    ]
  };
}

module.exports = UrlExtension;
