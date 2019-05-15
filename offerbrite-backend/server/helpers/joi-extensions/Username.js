const validationRules = require('../../validation-rules');
const _ = require('lodash');

const normalizeUsername = _.flow([
  _.trim,
  text => _.split(text, ' '),
  words => _.reject(words, _.isEmpty),
  words => _.join(words, ' ')
]);

function UsernameExtension(joi) {
  return {
    base: joi.string(),
    name: 'string',
    language: {
      invalidUsername: 'must contains only letters and digits'
    },
    rules: [
      {
        name: 'isUsername',
        validate(params, value, state, options) {
          if (!validationRules.user.username.regExp.test(value)) {
            return this.createError('string.invalidUsername', { value }, state, options);
          }
          return normalizeUsername(value);
        }
      }
    ]
  };
}

module.exports = UsernameExtension;
