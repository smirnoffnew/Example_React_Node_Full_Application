const Joi = require('joi');

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  IMAGES_CLEANER_CRON_SCHEDULE: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('production'),
      then: Joi.string()
        .default('0 0 */1 * *'), // every day at midnight
      otherwise: Joi.string()
        .default('*/5 * * * * *') // every 5 seconds
    }),
  OFFERS_CLEANER_CRON_SCHEDULE: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('production'),
      then: Joi.string()
        .default('0 */1 * * *'), // every hour
      otherwise: Joi.string()
        .default('*/5 * * * * *') // every 5 seconds
    }),
  CRON_IMAGES_CLEANER_ENABLED: Joi.boolean()
    .default(true),
  CRON_OFFERS_CLEANER_ENABLED: Joi.boolean()
    .default(true)
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  schedules: {
    images: envVars.IMAGES_CLEANER_CRON_SCHEDULE,
    offers: envVars.OFFERS_CLEANER_CRON_SCHEDULE,
  },
  offersCleanerEnabled: envVars.CRON_OFFERS_CLEANER_ENABLED,
  imagesCleanerEnabled: envVars.CRON_IMAGES_CLEANER_ENABLED,
};

module.exports = config;
