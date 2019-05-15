const Joi = require('joi');

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  JWT_REFRESH_EXP: Joi.number()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('test'),
      then: Joi.number()
        .default(2 * 1e3),
      otherwise: Joi.number()
        .default(60 * 60 * 24 * 30 * 1e3) //  30 days
    })
    .description('Lifetime of JWT refresh token'),
  JWT_ACCESS_EXP: Joi.number()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('test'),
      then: Joi.number()
        .default(2 * 1e3),
      otherwise: Joi.number()
        .default(60 * 60 * 1e3) // 1 hour
    })
    .description('Lifetime of JWT access token'),
  JWT_PASSWORD_RESET_EXP: Joi.number()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('test'),
      then: Joi.number()
        .default(3 * 1e3), // 3 seconds
      otherwise: Joi.number()
        .default(60 * 60 * 1e3) // 1 hour
    }),
  PASSWORD_RESET_TIMEOUT: Joi.number()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('test'),
      then: Joi.number()
        .default(1 * 1e3), // 1 second
      otherwise: Joi.number()
        .default(60 * 1 * 1e3) // 1 minute
    }),
  JWT_SECRET_ACCESS_USER: Joi.string()
    .default()
    .description('JWT Secret required to sign'),
  JWT_SECRET_REFRESH_USER: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  JWT_SECRET_PASSWORD_RESET: Joi.string()
    .required()
    .description('JWT Secret required to password reset'),
  JWT_SECRET_REFRESH_BUSINESS_USER: Joi.string()
    .default()
    .description('JWT Secret required to sign'),
  JWT_SECRET_ACCESS_BUSINESS_USER: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  JWT_SECRET_PASSWORD_RESET_BUSINESS_USER: Joi.string()
    .required()
    .description('JWT Secret required to password reset'),
  JWT_SECRET_ACCESS_ADMIN: Joi.string()
  .required()
  .description('JWT Secret required to sign'),
  JWT_SECRET_REFRESH_ADMIN: Joi.string()
  .required()
  .description('JWT Secret required to sign'),
  DEFAULT_ADMIN_EMAIL: Joi.string()
    .required(),
  DEFAULT_ADMIN_PASSWORD: Joi.string()
    .required()
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  jwtSecretAccessUser: envVars.JWT_SECRET_ACCESS_USER,
  jwtSecretRefreshUser: envVars.JWT_SECRET_REFRESH_USER,
  jwtSecretAccessAdmin: envVars.JWT_SECRET_ACCESS_ADMIN,
  jwtSecretRefreshAdmin: envVars.JWT_SECRET_REFRESH_ADMIN,
  jwtSecretPasswordReset: envVars.JWT_SECRET_PASSWORD_RESET,
  jwtSecretAccessBusinessUser: envVars.JWT_SECRET_ACCESS_BUSINESS_USER,
  jwtSecretRefreshBusinessUser: envVars.JWT_SECRET_REFRESH_BUSINESS_USER,
  jwtSecretPasswordResetBusinessUser: envVars.JWT_SECRET_PASSWORD_RESET_BUSINESS_USER,
  jwtExpAccess: envVars.JWT_ACCESS_EXP,
  jwtExpRefresh: envVars.JWT_REFRESH_EXP,
  jwtExpPasswordReset: envVars.JWT_PASSWORD_RESET_EXP,
  passwordResetTimeout: envVars.PASSWORD_RESET_TIMEOUT,
  admin: {
    email: envVars.DEFAULT_ADMIN_EMAIL,
    password: envVars.DEFAULT_ADMIN_PASSWORD
  }
};

module.exports = config;
