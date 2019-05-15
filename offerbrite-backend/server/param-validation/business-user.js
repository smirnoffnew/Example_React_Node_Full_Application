const validationRules = require('../validation-rules/index');

module.exports = (Joi, ctx) => ({
  // POST/api/v1/business-users
  create: {
    body: {
      email: Joi.string()
        .isEmail()
        .required(),
      password: Joi.string()
        .trim()
        .min(validationRules.businessUser.password.min)
        .max(validationRules.businessUser.password.max)
        .isPassword()
        .required(),
      isNotificationsEnabled: Joi.boolean()
    }
  },
  // GET/api/v1/business-users
  list: {
    query: {
      ...ctx.DEFAULT_LIST_QUERY
    }
  },
  // PUT/api/v1/business-users/:id
  update: {
    body: {
      email: Joi.any()
        .forbidden(),
      password: Joi.any()
        .forbidden(),
      username: Joi.string()
        .trim()
        .min(validationRules.businessUser.username.min)
        .max(validationRules.businessUser.username.max)
        .isUsername(),
      isNotificationsEnabled: Joi.boolean()
    }
  },
  // PUT/api/v1/business-users/:id/email
  updateEmail: {
    body: {
      email: Joi.string()
        .isEmail()
        .required()
    }
  },
  // PUT/api/v1/business-users/:id/password
  updatePassword: {
    body: {
      password: Joi.string()
        .trim()
        .min(validationRules.businessUser.password.min)
        .max(validationRules.businessUser.password.max)
        .isPassword()
        .required()
    }
  },
});
