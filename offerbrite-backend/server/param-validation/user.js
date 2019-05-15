const validationRules = require('../validation-rules/index');

module.exports = (Joi, ctx) => ({
  // POST/api/v1/users
  create: {
    body: {
      email: Joi.string()
        .isEmail()
        .required(),
      password: Joi.string()
        .trim()
        .min(validationRules.user.password.min)
        .max(validationRules.user.password.max)
        .isPassword()
        .required(),
      username: Joi.string()
        .trim()
        .min(validationRules.user.username.min)
        .max(validationRules.user.username.max)
        .isUsername()
        .required(),
      isNotificationsEnabled: Joi.boolean()
    }
  },
  // GET/api/v1/users
  list: {
    query: {
      ...ctx.DEFAULT_LIST_QUERY
    }
  },
  // PUT/api/v1/users/:id
  update: {
    body: {
      email: Joi.any()
        .forbidden(),
      password: Joi.any()
        .forbidden(),
      username: Joi.string()
        .trim()
        .min(validationRules.user.username.min)
        .max(validationRules.user.username.max)
        .isUsername(),
      isNotificationsEnabled: Joi.boolean()
    }
  },
  // PUT/api/v1/users/:id/email
  updateEmail: {
    body: {
      email: Joi.string()
        .isEmail()
        .required()
    }
  },
  // PUT/api/v1/users/:id/password
  updatePassword: {
    body: {
      password: Joi.string()
        .trim()
        .min(validationRules.user.password.min)
        .max(validationRules.user.password.max)
        .isPassword()
        .required()
    }
  },
  // POST/api/v1/auth/reset-password
  sendPasswordResetToken: {
    body: {
      email: Joi.string()
        .isEmail()
        .required()
    }
  },
});
