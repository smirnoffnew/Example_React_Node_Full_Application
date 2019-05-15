/* eslint-disable global-require */
require('dotenv')
  .config();
const path = require('path');
const Joi = require('joi');

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  IS_PROD: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('production'),
      then: Joi.boolean()
        .default(true),
      otherwise: Joi.boolean()
        .default(false)
    }),
  HOST: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string()
        .equal('production'),
      then: Joi.string()
        .default('http://159.65.124.118:4040'),
      otherwise: Joi.string()
        .default('http://127.0.0.1:3000')
    })
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  isProduction: envVars.IS_PROD,
  pathToSPA: path.join(__dirname, '../public/index.html'),
  pathToPublicDir: path.join(__dirname, '../public'),
  port: envVars.PORT,
  host: envVars.HOST,
  auth: require('./auth'),
  log: require('./log'),
  mongo: require('./mongo'),
  resources: require('./resources'),
  redis: require('./redis'),
  mailer: require('./mailer'),
  rolesConfig: require('./roles-config/index'),
  firebase: require('./firebase'),
  uploads: require('./uploads'),
  cron: require('./cron'),
  offer: require('./offer')
};

module.exports = config;
