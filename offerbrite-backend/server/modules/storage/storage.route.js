const express = require('express');
const auth = require('../../helpers/passport/index');
const storageCtrl = require('./storage.controller');
const validate = require('express-validation');
const paramValidation = require('../../param-validation/index');
const storageAccessControl = require('./storage.access');
const validators = require('../../helpers/utils/index').validators;
const helpers = require('../../helpers/utils/index');
const config = require('../../../config/index');

const router = express.Router();
const storageRoute = express.Router();

storageRoute.route('/image')
  .get(
    auth.jwtAnyAccess,
    storageAccessControl.listFiles,
    validate(paramValidation.storage.list),
    storageCtrl.list
  )
  .post(
    auth.jwtAnyAccess,
    storageAccessControl.uploadImage,
    storageCtrl.multerForImages()
      .single('image'),
    storageCtrl.appendBufferToLocalSavedFile,
    validators.isImageSingleFile,
    validators.isAllowedImageSize,
    storageCtrl.uploadSingleFile(config.uploads.imagesDir),
    storageCtrl.cleanUpImage,
    storageCtrl.registerFile,
    storageCtrl.sendFileMediaUrl
  )
  .delete(
    auth.jwtAnyAccess,
    storageAccessControl.deleteImage,
    validate(paramValidation.storage.delete),
    storageCtrl.deleteFile,
    helpers.middlewares.ok
  );
router.use('/storage', storageRoute);
module.exports = router;
