const Joi = require('joi');
const uuid4 = require('uuid/v4');

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  MAX_UPLOADING_FILES_SIZE: Joi.number()
    .default(4 * 1024 * 1024)
    .description('max size of accepted uploads to server'),
  IMAGES_UPLOADING_DIR: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('test'),
      then: Joi.string()
        .default(`${uuid4()}`),
      otherwise: Joi.string()
        .default('images'),
    }),
  IMAGES_UNUSED_TIME_LATENCY: Joi.number()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('production'),
      then: Joi.number()
        .default(60 * 60 * 1e3), // 1 hour
      otherwise: Joi.number()
        .default(3 * 1e3), // 3 seconds
    }),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  maxSize: envVars.MAX_UPLOADING_FILES_SIZE,
  imagesDir: envVars.IMAGES_UPLOADING_DIR,
  unusedImagesTimeLatency: envVars.IMAGES_UNUSED_TIME_LATENCY
};

module.exports = config;
