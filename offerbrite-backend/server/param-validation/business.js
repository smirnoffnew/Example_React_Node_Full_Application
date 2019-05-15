const validationRules = require('../validation-rules/index');

module.exports = (Joi, ctx) => ({
  // POST/api/v1/businesses
  create: {
    body: {
      brandName: Joi.string()
        .trim()
        .min(validationRules.business.brandName.min)
        .max(validationRules.business.brandName.max)
        .regex(validationRules.business.brandName.regExp)
        .required(),
      description: Joi.string()
        .trim()
        .min(validationRules.business.description.min)
        .max(validationRules.business.description.max)
        .regex(validationRules.business.description.regExp),
      logoUrl: Joi.url()
        .isUrlOfFileAtStore()
        .allow('')
        .default(''),
      locations: Joi.array()
        .items(ctx.isLocation)
        .min(validationRules.business.locations.min)
        .max(validationRules.business.locations.max)
        .required(),
      mobileNumbers: Joi.array()
        .items(Joi.string()
          .trim()
          .isMobileNumber())
        .min(validationRules.business.mobileNumbers.min)
        .max(validationRules.business.mobileNumbers.max)
        .required(),
      websiteUrl: Joi.url()
        .allow('')
        .trim()
        .isUrl(),
    }
  },
  // PUT /api/v1/businesses/:id
  update: {
    body: {
      brandName: Joi.string()
        .trim()
        .min(validationRules.business.brandName.min)
        .max(validationRules.business.brandName.max)
        .regex(validationRules.business.brandName.regExp),
      description: Joi.string()
        .trim()
        .min(validationRules.business.description.min)
        .max(validationRules.business.description.max)
        .regex(validationRules.business.description.regExp),
      logoUrl: Joi.url()
        .isUrlOfFileAtStore()
        .allow('')
        .default(''),
      locations: Joi.array()
        .items(ctx.isLocation)
        .min(validationRules.business.locations.min)
        .max(validationRules.business.locations.max),
      mobileNumbers: Joi.array()
        .items(Joi.string()
          .trim()
          .isMobileNumber())
        .min(validationRules.business.mobileNumbers.min)
        .max(validationRules.business.mobileNumbers.max),
      websiteUrl: Joi.url()
        .allow('')
        .trim()
        .isUrl(),
    }
  },
  // GET /api/v1/businesses/
  list: {
    query: {
      ...ctx.DEFAULT_LIST_QUERY
    }
  },
});
