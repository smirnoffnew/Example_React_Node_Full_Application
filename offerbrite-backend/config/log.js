const Joi = require('joi');
const path = require('path');

// define validation for all the env vars
const envVarsSchema = Joi.object({
  DEBUG: Joi.string(),
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  LOG_LVL: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('development'),
      then: Joi.string()
        .default('debug'),
      otherwise: Joi.string()
        .default('info')
    }),
  LOG_TIMESTAMPS: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('production'),
      then: Joi.boolean()
        .default(true),
      otherwise: Joi.boolean()
        .default(false)
    }),
  LOG_EXPRESS: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('production'),
      then: Joi.boolean()
        .default(false),
      otherwise: Joi.boolean()
        .default(true)
    }),
  ENABLE_LOG: Joi.boolean()
    .when('DEBUG', {
      is: Joi.string()
        .exist(),
      then: Joi.boolean()
        .default(true),
      otherwise: Joi.boolean()
        .default(false)
    })
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  enableLog: !envVars.ENABLE_LOG ? !!envVars.DEBUG || envVars.NODE_ENV !== 'test' : true,
  level: envVars.LOG_LVL,
  timestamps: envVars.LOG_TIMESTAMPS,
  express: envVars.LOG_EXPRESS,
  output: path.resolve('logs/app.log')
};

module.exports = config;
