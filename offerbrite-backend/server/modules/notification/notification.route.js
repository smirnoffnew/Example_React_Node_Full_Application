const express = require('express');
const notificationCtrl = require('./notification.controller');
const validate = require('express-validation');
const auth = require('../../helpers/passport/index');

const router = express.Router();
const notificationRoute = express.Router();

validate.options({
  allowUnknownBody: false,
});

notificationRoute
.route('/list')
.get(auth.jwtAnyAccess, notificationCtrl.list);

notificationRoute
.route('/:notificationId')
.get(auth.jwtAnyAccess, notificationCtrl.getOne)
.put(auth.jwtAnyAccess, notificationCtrl.updateOne)
.delete(auth.jwtAnyAccess, notificationCtrl.deleteById);

notificationRoute
.route('/sendTest')
.post(auth.jwtAnyAccess, notificationCtrl.sendNotification);

notificationRoute
.route('/send')
.post(auth.jwtAnyAccess, notificationCtrl.sendAdminNotification);

router.use('/notification', notificationRoute);

module.exports = router;
