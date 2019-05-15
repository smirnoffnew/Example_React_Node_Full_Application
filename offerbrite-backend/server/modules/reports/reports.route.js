const express = require('express');
const validate = require('express-validation');
const reportsCtrl = require('./reports.controller');
const auth = require('../../helpers/passport/index');

validate.options({
  allowUnknownBody: false,
});

const router = express.Router();
const reportRouter = express.Router();

reportRouter
  .route('/')
  .get(auth.jwtAnyAccess, reportsCtrl.getReports)
  .post(auth.jwtAnyAccess, reportsCtrl.createdReports);

router.use('/reports', reportRouter);
module.exports = router;
