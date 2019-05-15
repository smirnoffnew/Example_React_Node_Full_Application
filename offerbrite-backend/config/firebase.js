const Joi = require('joi');
const path = require('path');
// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  FIREBASE_APP_NAME: Joi.string()
    .default('Offerbrite'),
  FIREBASE_SERVICE_ACCOUNT_PATH: Joi.string()
    .default(path.resolve('firebase.service.account.json'))
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  pathToServiceAccount: envVars.FIREBASE_SERVICE_ACCOUNT_PATH,
  name: envVars.FIREBASE_APP_NAME
};
module.exports = config;
