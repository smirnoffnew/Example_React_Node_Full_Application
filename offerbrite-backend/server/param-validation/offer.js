const validationRules = require('../validation-rules/index');

module.exports = (Joi, ctx) => ({
  // POST /api/v1/offers
  create: {
    body: {
      title: Joi.string()
        .trim()
        .max(validationRules.offer.title.max)
        .min(validationRules.offer.title.min)
        .required(),
      description: Joi.string()
        .trim()
        .allow('')
        .max(validationRules.offer.description.max)
        .min(validationRules.offer.description.min),
      category: ctx.Category.required(),
      imagesUrls: Joi.array()
        .items(
          Joi.url()
            .isUrlOfFileAtStore()
            .optional(),
        )
        .max(validationRules.offer.imagesUrls.max)
        .min(validationRules.offer.imagesUrls.min)
        .unique()
        .required(),
      isDateHidden: Joi.boolean(),
      locations: Joi.array()
        .items(ctx.isOfferLocation) //  lat / lng not required
        .min(validationRules.offer.locations.min)
        .max(validationRules.offer.locations.max)
        .required(),
      endDate: Joi.dateOfOffer()
        .isEndDateOfOffer()
        .required()
        // .isEndDateOfOffer(Joi.ref('$body.startDate'))
        .required(), // YYYY-MM-DD=00:00 // max 30 day after start
      startDate: Joi.dateOfOffer()
        .isStartDateOfOffer()
        .required(), // 30
      fullPrice: Joi.number()
        .min(0),
      discount: Joi.number()
        .max(100)
        .min(0),
    }
  },
  // PUT /api/v1/offers
  update: {
    body: {
      title: Joi.string()
        .trim()
        .max(validationRules.offer.title.max)
        .min(validationRules.offer.title.min),
      description: Joi.string()
        .trim()
        .allow('')
        .max(validationRules.offer.description.max)
        .min(validationRules.offer.description.min),
      category: ctx.Category,
      imagesUrls: Joi.array()
        .items(
          Joi.url()
            .isUrlOfFileAtStore()
            .optional(),
        )
        .unique()
        .max(validationRules.offer.imagesUrls.max)
        .min(validationRules.offer.imagesUrls.min),
      isDateHidden: Joi.boolean(),
      locations: Joi.array()
        .items(ctx.isOfferLocation)
        .min(validationRules.offer.locations.min)
        .max(validationRules.offer.locations.max),
      endDate: Joi.dateOfOffer()
        .isEndDateOfOffer(),
      startDate: Joi.dateOfOffer()
        .isStartDateOfOffer(),
      fullPrice: Joi.number()
        .min(0),
      discount: Joi.number()
        .max(100)
        .min(0),
    }
  },
  // GET /api/v1/offers
  list: {
    query: {
      ...ctx.DEFAULT_LIST_QUERY,
      category: Joi.alternatives(
        [
          Joi.string(),
          Joi.array()
            .items(Joi.string())
        ]
      ),
      status: Joi.string()
        .valid(['active', 'deferred', 'past', 'all'])
        .default('active'),
      loc_address: Joi.string(),
      loc_longitude: Joi.number()
        .less(180)
        .greater(-180),
      loc_latitude: Joi.number()
        .less(90)
        .greater(-90),
      loc_radius: Joi.number()
        .greater(100)
        .default(1e4)
    }
  }
});
