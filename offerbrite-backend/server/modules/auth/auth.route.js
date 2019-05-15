const express = require('express');
const auth = require('../../helpers/passport/index');
const authCtrl = require('./auth.controller');
const validate = require('express-validation');
const paramValidation = require('../../param-validation/index');

const router = express.Router();
const authRoute = express.Router();

authRoute.post('/login', auth.basicUser, authCtrl.login);
authRoute.get('/login', auth.jwtUserAccess, authCtrl.get);
authRoute.get('/token', auth.jwtUserRefresh, authCtrl.genAccessToken);
authRoute.get('/check-access', auth.jwtUserAccess, authCtrl.check);
authRoute.get('/check-refresh', auth.jwtUserRefresh, authCtrl.check);

authRoute
  .route('/reset-password')
  .post(validate(paramValidation.user.sendPasswordResetToken), authCtrl.sendResetPasswordTokenUser)
  .put(
    validate(paramValidation.user.updatePassword),
    auth.jwtPasswordResetUser,
    authCtrl.resetPasswordUser
  );
router.use('/auth', authRoute);
module.exports = router;
