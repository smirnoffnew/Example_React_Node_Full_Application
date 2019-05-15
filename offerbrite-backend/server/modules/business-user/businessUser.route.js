const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../param-validation/index');
const businessUserCtrl = require('./businessUser.controller');
const businessUserAccessControl = require('./businessUser.access');
const helpers = require('../../helpers/utils/index');
const auth = require('../../helpers/passport/index');
const BusinessUser = require('./businessUser.model');


validate.options({
  allowUnknownBody: false,
});

const router = express.Router();
const businessUserRoute = express.Router();

businessUserRoute
  .route('/')
  .post(
    validate(paramValidation.businessUser.create),
    helpers.validators.isUniqueEmail(BusinessUser),
    businessUserCtrl.create,
    businessUserCtrl.login
  )
  .get(auth.jwtAnyAccess,
    businessUserAccessControl.list,
    validate(paramValidation.businessUser.list),
    businessUserCtrl.list);

businessUserRoute
  .route('/:businessUserId')
  .get(auth.jwtAnyAccess, businessUserAccessControl.get, businessUserCtrl.get)
  .put(
    auth.jwtAnyAccess,
    businessUserAccessControl.update,
    validate(paramValidation.businessUser.update),
    businessUserCtrl.update,
    businessUserCtrl.get
  )
  .delete(
    auth.basicBusinessUser,
    businessUserAccessControl.delete,
    businessUserCtrl.delete, businessUserCtrl.get
  );

businessUserRoute.put(
  '/:businessUserId/password',
  auth.basicBusinessUser,
  businessUserAccessControl.updatePassword,
  validate(paramValidation.businessUser.updatePassword),
  businessUserCtrl.updatePassword,
  businessUserCtrl.get
);
businessUserRoute.put(
  '/:businessUserId/email',
  auth.basicBusinessUser,
  businessUserAccessControl.updateEmail,
  validate(paramValidation.businessUser.updateEmail),
  helpers.validators.isUniqueEmail(BusinessUser),
  businessUserCtrl.updateEmail,
  businessUserCtrl.get
);

businessUserRoute.param('businessUserId', helpers.validators.validateId(businessUserCtrl.load));
router.use('/business-users', businessUserRoute);
module.exports = router;
