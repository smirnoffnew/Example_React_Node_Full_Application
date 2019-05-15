const validationRules = require('../../validation-rules');

function PasswordExtension(joi) {
  return {
    base: joi.string(),
    name: 'string',
    language: {
      noUpperCase: 'missing uppercase letter',
      noLowerCase: 'missing lowercase letter',
      noDigits: 'missing digits',
      noLetters: 'missing letters',
      noSpecial: 'missing special symbols',
      invalidDifficultPassword:
        'must contains at least one upper and lower case letters, one digit and special symbol',
      invalidPassword:
        'must contains at least one letter and one digit'
    },
    rules: [
      {
        name: 'isDifficultPassword',
        validate(params, value, state, options) {
          if (!validationRules.user.password.regExp.test(value)) {
            if (!/.*[a-z].*/.test(value)) {
              return this.createError('string.noLowerCase', { value }, state, options);
            }
            if (!/.*[A-Z].*/.test(value)) {
              return this.createError('string.noUpperCase', { value }, state, options);
            }
            if (!/.*\d.*/.test(value)) {
              return this.createError('string.noDigits', { value }, state, options);
            }
            if (!/.*[!@#$%^&*].*/.test(value)) {
              return this.createError('string.noSpecial', { value }, state, options);
            }
            return this.createError('string.invalidDifficultPassword', { value }, state, options);
          }
          return value;
        }
      },
      {
        name: 'isPassword',
        validate(params, value, state, options) {
          if (!validationRules.user.password.regExp.test(value)) {
            if (!/.*[A-Za-z].*/.test(value)) {
              return this.createError('string.noLetters', { value }, state, options);
            }
            if (!/.*\d.*/.test(value)) {
              return this.createError('string.noDigits', { value }, state, options);
            }
            return this.createError('string.invalidPassword', { value }, state, options);
          }
          return value;
        }
      }
    ]
  };
}

module.exports = PasswordExtension;
