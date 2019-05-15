const express = require('express');
const categoriesCtrl = require('./category.controller');
const validate = require('express-validation');
const paramValidation = require('../../param-validation/index');
const auth = require('../../helpers/passport/index');
const categoryAccessControl = require('./category.access');
const helpers = require('../../helpers/utils/index');
const Category = require('./category.model');

const router = express.Router();
const categoryRoute = express.Router();

categoryRoute.route('/')
  .get(validate(paramValidation.category.list), categoriesCtrl.list)
  .post(
    auth.jwtAnyAccess,
    categoryAccessControl.create,
    validate(paramValidation.category.create),
    categoriesCtrl.create,
    categoriesCtrl.get
  );

categoryRoute.route('/:categoryId')
  .get(categoriesCtrl.get)
  .delete(
    auth.jwtAnyAccess,
    categoryAccessControl.delete,
    categoriesCtrl.delete,
    categoriesCtrl.get
  )
  .put(
    auth.jwtAnyAccess,
    categoryAccessControl.update,
    validate(paramValidation.category.update),
    helpers.validators.isUnique('name', Category),
    categoriesCtrl.update,
    categoriesCtrl.get
  );

categoryRoute.param('categoryId', helpers.validators.validateId(categoriesCtrl.load));
router.use('/categories', categoryRoute);
module.exports = router;
