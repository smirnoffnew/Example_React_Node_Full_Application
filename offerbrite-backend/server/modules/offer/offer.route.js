const express = require('express');
const offerCtrl = require('./offer.controller');
const validate = require('express-validation');
const paramValidation = require('../../param-validation/index');
const auth = require('../../helpers/passport/index');
const offerAccessControl = require('./offer.access');
const helpers = require('../../helpers/utils/index');
const businessCtrl = require('../business/business.controller');

validate.options({
  allowUnknownBody: false,
});

const router = express.Router();
const offerRoute = express.Router();
const businessRoute = express.Router();

businessRoute.post('/:businessId/offers',
  auth.jwtAnyAccess,
  offerAccessControl.create,
  validate(paramValidation.offer.create),
  helpers.validators.isImageExistAtRemoteStorage('imagesUrls'),
  offerCtrl.create,
  offerCtrl.get);

offerRoute.route('/')
  .get(validate(paramValidation.offer.list), offerCtrl.list);

offerRoute.route('/:offerId')
  .get(
    validate(paramValidation.offer.list),
    offerCtrl.get
  )
  .delete(
    auth.jwtAnyAccess,
    offerAccessControl.delete,
    offerCtrl.delete,
    offerCtrl.get
  )
  .put(
    auth.jwtAnyAccess,
    offerAccessControl.update,
    validate(paramValidation.offer.update),
    helpers.validators.isImageExistAtRemoteStorage('imagesUrls'),
    offerCtrl.update,
    offerCtrl.get
  );
offerRoute.route('/addShared/:offerId')
.put(offerCtrl.addShared);
offerRoute.route('/addFavorite/:offerId')
.put(offerCtrl.addFavorite);
offerRoute.route('/addView/:offerId')
.put(offerCtrl.addView);


businessRoute.param('businessId', helpers.validators.validateId(businessCtrl.load));
offerRoute.param('offerId', helpers.validators.validateId(offerCtrl.load));

router.use('/businesses', businessRoute);
router.use('/offers', offerRoute);
module.exports = router;
