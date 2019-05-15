const Joi = require('joi');

// define validation for all the env vars
const envVarsSchema = Joi.object({
  EMAIL_ADDRESS: Joi.string()
    .required()
    .description('Email\'s address for letters sending'),
  EMAIL_PASSWORD: Joi.string()
    .required()
    .description('Email\'s password for letters sending'),
  EMAIL_SERVICE: Joi.string()
    .required()
    .default('gmail')
    .description('Email\'s type, valid ')
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  emailAddress: envVars.EMAIL_ADDRESS,
  emailPassword: envVars.EMAIL_PASSWORD,
  emailService: envVars.EMAIL_SERVICE
};

module.exports = config;
