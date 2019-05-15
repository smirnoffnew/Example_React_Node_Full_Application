const Joi = require('joi');
const moment = require('moment');

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  OFFER_TIME_TOLERANCE: Joi.number()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('production'),
      then: Joi.number()
        .default(moment.duration(10, 'd')
          .asMilliseconds()), // 10 days
      otherwise: Joi.number()
        .default(moment.duration(5, 's')
          .asMilliseconds()) // 5 seconds
    }),

})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  timeTolerance: envVars.OFFER_TIME_TOLERANCE
};

module.exports = config;
