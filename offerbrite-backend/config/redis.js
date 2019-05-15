const Joi = require('joi');

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  REDIS_URL: Joi.string()
    .description('address from Redis DB')
    .required(),
  REDIS_PSW: Joi.string()
    .description('password from Redis DB')
    .required()
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  url: envVars.REDIS_URL,
  password: envVars.REDIS_PSW
};

module.exports = config;
