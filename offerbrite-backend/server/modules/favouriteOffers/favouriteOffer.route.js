const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../param-validation/index');
const favouritesOffersCtrl = require('./favouriteOffer.controller');
const favouritesOffersAccess = require('./favouriteOffer.access');
const helpers = require('../../helpers/utils/index');
const auth = require('../../helpers/passport/index');
const offerCtrl = require('../offer/offer.controller');
const userCtrl = require('../user/user.controller');

validate.options({
  allowUnknownBody: false,
});

const router = express.Router();
const favouritesOffersRouter = express.Router();
const userRouter = express.Router();


favouritesOffersRouter
  .route('/')
  .get(auth.jwtAnyAccess,
    favouritesOffersAccess.list,
    validate(paramValidation.favouriteOffers.list),
    favouritesOffersCtrl.list);

favouritesOffersRouter
  .route('/:offerId')
  .post(
    auth.jwtAnyAccess,
    favouritesOffersAccess.create,
    favouritesOffersCtrl.itDoesNotAlreadyExistsAtFavourites,
    favouritesOffersCtrl.create,
    helpers.middlewares.ok
  )
  .delete(
    auth.jwtAnyAccess,
    favouritesOffersAccess.delete,
    favouritesOffersCtrl.delete,
    helpers.middlewares.ok
  );

userRouter.param('userId', helpers.validators.validateId(userCtrl.load));
favouritesOffersRouter.param('offerId', helpers.validators.validateId(offerCtrl.load));
userRouter.use('/:userId/favourite-offers', favouritesOffersRouter);
router.use('/users', userRouter);

module.exports = router;
