const phoneUtil = require('google-libphonenumber')
  .PhoneNumberUtil
  .getInstance();

function MobilePhoneExtension(joi) {
  return {

    base: joi.string(),
    name: 'string',
    language: {
      notPhoneNumber: 'The string {{value}} is not a valid phone number',
      notLocalPhoneNumber: 'The number {{value}} is not a valid phone number of {{cc}}',
      outOfFormat: 'The number {{value}} is not in a format "+CC0123456789"'
    },
    rules: [
      {
        name: 'isMobileNumber',
        validate(params, value, state, options) {
          try {
            const phone = phoneUtil.parseAndKeepRawInput(value);
            if (!(phoneUtil.isValidNumber(phone) && phoneUtil.isPossibleNumber(phone))) {
              return this.createError('string.notPhoneNumber', { value }, state, options);
            }
            return {
              region: phoneUtil.getRegionCodeForNumber(phone),
              number: phone.getNationalNumber(),
              cc: phone.getCountryCode()
            };
          } catch (err) {
            return this.createError('string.outOfFormat', { value }, state, options);
          }
        }
      },
    ]
  };
}

module.exports = MobilePhoneExtension;
