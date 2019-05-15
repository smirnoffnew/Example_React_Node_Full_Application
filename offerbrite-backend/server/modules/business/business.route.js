const express = require('express');
const businessCtrl = require('./business.controller');
const validate = require('express-validation');
const paramValidation = require('../../param-validation/index');
const auth = require('../../helpers/passport/index');
const businessAccessControl = require('./business.access');
const helpers = require('../../helpers/utils/index');

const router = express.Router();
const businessRoute = express.Router();

validate.options({
  allowUnknownBody: false,
});

businessRoute.route('/')
  .get(validate(paramValidation.business.list), businessCtrl.list)
  .post(
    auth.jwtAnyAccess,
    businessAccessControl.create,
    validate(paramValidation.business.create),
    helpers.validators.isUserCanCreateNewBusiness,
    helpers.validators.isImageExistAtRemoteStorage('logoUrl'),
    businessCtrl.create,
    businessCtrl.get,
  );

businessRoute.route('/:businessId')
  .get(businessCtrl.get)
  .delete(
    auth.jwtAnyAccess,
    businessAccessControl.delete,
    businessCtrl.delete,
    businessCtrl.get
  )
  .put(
    auth.jwtAnyAccess,
    businessAccessControl.update,
    validate(paramValidation.business.update),
    helpers.validators.isImageExistAtRemoteStorage('logoUrl'),
    businessCtrl.update,
    businessCtrl.get
  );


businessRoute.param('businessId', helpers.validators.validateId(businessCtrl.load));
router.use('/businesses', businessRoute);
module.exports = router;
