const express = require('express');
const validate = require('express-validation');
const paramValidation = require('../../param-validation/index');
const userCtrl = require('./user.controller');
const userAccessControl = require('./user.access');
const helpers = require('../../helpers/utils/index');
const auth = require('../../helpers/passport/index');
const User = require('./user.model');

validate.options({
  allowUnknownBody: false,
});

const router = express.Router();
const userRouter = express.Router();

userRouter
  .route('/')
  .post(
    validate(paramValidation.user.create),
    helpers.validators.isUniqueEmail(User),
    userCtrl.create,
    userCtrl.login
  )
  .get(auth.jwtAnyAccess,
    userAccessControl.list,
    validate(paramValidation.user.list),
    userCtrl.list);

userRouter
  .route('/admin')
  .post(userCtrl.initAdmin)
  .put(auth.jwtAnyAccess, userCtrl.updateAdmin)
  .delete(auth.jwtAnyAccess, userCtrl.deleteAdmin);

userRouter
  .route('/auth/admin')
  .post(userCtrl.loginAdmin);

userRouter
  .route('/auth/login')
  .get(auth.basicUser, userCtrl.loginToAdmin);

userRouter
  .route('/admin/all')
  .get(auth.jwtAnyAccess, userCtrl.getAllAdmin);

userRouter
  .route('/admin/allUsers')
  .get(auth.jwtAnyAccess, userCtrl.getAllUsers);

userRouter
  .route('/admin/allBusinessUsers')
  .get(auth.jwtAnyAccess, userCtrl.getAllBusinessUsers);

userRouter
.route('/admin/businessUsers/:businessUserId')
.put(auth.jwtAnyAccess, userCtrl.updateBusinesUserById)
.delete(auth.jwtAnyAccess, userCtrl.deleteBusinessUserById);

userRouter
.route('/admin/allOffers')
.get(auth.jwtAnyAccess, userCtrl.getAllOffers);

userRouter
.route('/admin/offer/:offerId')
.get(auth.jwtAnyAccess, userCtrl.getOfferById)
.put(auth.jwtAnyAccess, userCtrl.updateOfferById)
.delete(auth.jwtAnyAccess, userCtrl.deleteOfferById);

userRouter
.route('/admin/reports/:reportId')
.delete(auth.jwtAnyAccess, userCtrl.deleteReportById);

userRouter
.route('/admin/users/:userId')
.put(auth.jwtAnyAccess, userCtrl.updateUserById)
.delete(auth.jwtAnyAccess, userCtrl.deleteUserById);

userRouter
.route('/admin/business/:businessId')
.get(auth.jwtAnyAccess, userCtrl.getBusinessById);

userRouter
  .route('/:userId')
  .get(auth.jwtAnyAccess, userAccessControl.get, userCtrl.get)
  .put(
    auth.jwtAnyAccess,
    userAccessControl.update,
    validate(paramValidation.user.update),
    userCtrl.update,
    userCtrl.get
  )
  .delete(auth.basicUser, userAccessControl.delete, userCtrl.delete, userCtrl.get);

userRouter
.route('/country/:userId')
.put(userCtrl.updateUserCountry);

userRouter
.route('/categories/:userId')
.put(userCtrl.updateUserCategories);

userRouter
.route('/tokenAndSystem/:userId')
.put(userCtrl.addUserTokenAndOperationSystem);

userRouter.put(
  '/:userId/password',
  auth.basicUser,
  userAccessControl.updatePassword,
  validate(paramValidation.user.updatePassword),
  userCtrl.updatePassword,
  userCtrl.get
);
userRouter.put(
  '/:userId/email',
  auth.basicUser,
  userAccessControl.updateEmail,
  validate(paramValidation.user.updateEmail),
  helpers.validators.isUniqueEmail(User),
  userCtrl.updateEmail,
  userCtrl.get
);

userRouter.param('userId', helpers.validators.validateId(userCtrl.load));

router.use('/users', userRouter);
module.exports = router;
