/* eslint-disable global-require */
const JoiExt = require('../helpers/joi-extensions/index');
const validationRules = require('../validation-rules/index');

const Joi = require('joi')
  .extend([
    JoiExt.Email,
    JoiExt.ObjectId,
    JoiExt.Password,
    JoiExt.MobilePhone,
    JoiExt.Username,
    JoiExt.Url,
    JoiExt.Location,
    JoiExt.DateOfOffer
  ]);


const DEFAULT_LIST_QUERY = {
  skip: Joi.number()
    .min(0),
  limit: Joi.number()
    .min(1)
    .max(100),
  populate: Joi.alternatives([Joi.array()
    .items(Joi.string()), Joi.string()])
};
const Category = Joi.string()
  .trim()
  .min(validationRules.category.name.min)
  .max(validationRules.category.name.max)
  .regex(validationRules.category.name.regExp);

const isPosition = Joi.object({
  longitude: Joi.number()
    .less(180)
    .greater(-180)
    .required(),
  latitude: Joi.number()
    .less(90)
    .greater(-90)
    .required()
});
const isLocation = Joi.object({
  position: isPosition.required(),
  address: Joi.object()
    .isAddress()
    .required()
});
const isOfferLocation = Joi.object({
  position: isPosition.optional(),
  address: Joi.object()
    .isAddress()
    .required()
});

const ctx = {
  DEFAULT_LIST_QUERY,
  Category,
  isPosition,
  isLocation,
  isOfferLocation
};

module.exports = {
  user: require('./user')(Joi, ctx),
  business: require('./business')(Joi, ctx),
  businessUser: require('./business-user')(Joi, ctx),
  offer: require('./offer')(Joi, ctx),
  category: require('./category')(Joi, ctx),
  storage: require('./storage')(Joi, ctx),
  favouriteOffers: require('./favouriteOffers')(Joi, ctx)
};
