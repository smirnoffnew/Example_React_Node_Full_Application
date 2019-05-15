const validator = require('validator');

function EmailExtension(joi) {
  return {
    base: joi.string(),
    name: 'string',
    language: {
      notAnEmail: 'is not an email'
    },
    rules: [
      {
        name: 'isEmail',
        validate(params, value, state, options) {
          if (validator.isEmail(value)) {
            return value;
          }
          return this.createError('string.notAnEmail', { value }, state, options);
        }
      }
    ]
  };
}

module.exports = EmailExtension;
