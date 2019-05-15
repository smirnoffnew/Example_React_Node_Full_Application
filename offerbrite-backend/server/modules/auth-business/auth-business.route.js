const express = require('express');
const auth = require('../../helpers/passport/index');
const businessAuthCtrl = require('./auth-business.controller');
const validate = require('express-validation');
const paramValidation = require('../../param-validation/index');

const router = express.Router();
const authBusiness = express.Router();

authBusiness.post('/login', auth.basicBusinessUser, businessAuthCtrl.login);
authBusiness.get('/login', auth.jwtBusinessUserAccess, businessAuthCtrl.get);
authBusiness.get('/token', auth.jwtBusinessUserRefresh, businessAuthCtrl.genAccessToken);
authBusiness.get('/check-access', auth.jwtBusinessUserAccess, businessAuthCtrl.check);
authBusiness.get('/check-refresh', auth.jwtBusinessUserRefresh, businessAuthCtrl.check);

authBusiness
  .route('/reset-password')
  .post(
    validate(paramValidation.user.sendPasswordResetToken),
    businessAuthCtrl.sendResetPasswordTokenUser
  )
  .put(
    validate(paramValidation.businessUser.updatePassword),
    auth.jwtPasswordResetBusinessUser,
    businessAuthCtrl.resetPassword
  );

router.use('/auth/business-users', authBusiness);
module.exports = router;
