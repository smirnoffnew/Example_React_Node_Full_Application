const Joi = require('joi');

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('production'),
    then: Joi.boolean().default(false),
    otherwise: Joi.boolean().default(true)
  }),
  MONGO_HOST: Joi.string()
    .required()
    .description('Mongo DB host url'),
  MONGO_PSW: Joi.string().description('Password from MongoDB server'),
  MONGO_USER: Joi.string().description('User from MongoDB server')
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  host: envVars.MONGO_HOST,
  debug: envVars.MONGOOSE_DEBUG,
  password: envVars.MONGO_PSW,
  user: envVars.MONGO_USER
};

module.exports = config;
