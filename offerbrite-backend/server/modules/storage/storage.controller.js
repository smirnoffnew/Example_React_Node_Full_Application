const config = require('../../../config/index');
const Firebase = require('../../services/firebase')
  .getClient();
const Multer = require('multer');
const uuidv4 = require('uuid/v4');
const fse = require('fs-extra');
const path = require('path');
const readChunk = require('read-chunk');
const StorageFile = require('./file.model');
const _ = require('lodash');
const debug = require('debug')('app:storage:ctrl');

const normalizeFileName = () => uuidv4();
/**
 * Returns function for uploading single file to storage
 * @param uploadToDir - destination dir
 */
exports.uploadSingleFile = uploadToDir => async (req, res, next) => {
  try {
    const { file } = req;
    req.uploadedFile = await Firebase.storage.uploadWithPath(
      uploadToDir,
      file.filename,
      path.join(file.destination, file.filename),
      {
        metadata: {
          owner: req.authUser.id
        },
        contentType: file.mimetype,
        gzip: true,
        public: true
      }
    );
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Reads firs 8 bytes of file from disk and appends it to file
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next object
 */
exports.appendBufferToLocalSavedFile = (req, res, next) => {
  if (req.file !== undefined) {
    return readChunk(path.join(req.file.destination, req.file.filename), 0, 8)
      .then((buffer) => {
        req.file.buffer = buffer;
        return next();
      })
      .catch(next);
  }
  return next();
};

/**
 * Builds multer instance for uploading images
 * @return {multer.Instance} instance of multer for uploading images
 */
exports.multerForImages = () => {
  const storage = Multer.diskStorage({
    destination: config.resources.uploadImagesDir,
    filename(req, file, cb) {
      cb(null, normalizeFileName());
    }
  });
  const multer = Multer({
    storage,
    limits: {
      fileSize: config.uploads.maxSize, // no larger than N mb, you can change as needed,
      files: 1 // for multipart forms, the max number of file fields
    }
  });
  return multer;
};

/**
 * Delete image from local disk
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next object
 */
exports.cleanUpImage = (req, res, next) => fse.unlink(
  path.join(req.file.destination, req.file.filename)
)
  .then(() => next())
  .catch(next);

/**
 * Returns file's media url
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next object
 */
exports.sendFileMediaUrl = (req, res) => res.json({ url: req.uploadedFile.publicLink });

/**
 * Deletes file from storage by it's URL
 * @param {string} url URL of file
 * @return {Promise<any>}
 */
exports.deleteFileByUrl = url => Firebase.storage.deleteFileByUrl(url);

/**
 * Deletes file from storage it's by url
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next object
 * @property {String} req.body.url url of file
 */
exports.deleteFile = (req, res, next) => StorageFile.removeByFirebaseUrl(req.body.url)
  .catch(() => Firebase.storage.deleteFileByUrl(req.body.url))
  .then(() => next());


exports.registerFile = (req, res, next) => {
  new StorageFile({
    fileName: req.uploadedFile.name,
    firebaseUrl: req.uploadedFile.publicLink,
    type: 'image'
  }).save()
    .then(() => next());
};

/**
 * List entities by query
 * @param {Express.Request} req request object
 * @param {Express.Response} res response object
 * @param {Express.Next} next next middleware
 * @property {string} req.query.skip - The numbers of entities to skip.
 * @property {string} req.query.limit - The limit of entities.
 */
exports.list = async (req, res, next) => {
  try {
    const {
      limit = 50, skip = 0, populate = false, ...query
    } = req.query;
    const paginatedResult = await StorageFile.list({
      limit,
      skip,
      populate,
      query
    });
    return res.json(paginatedResult);
  } catch (err) {
    return next(err);
  }
};


const addImagesReference = (url) => {
  debug('add ref to %s', url);
  return StorageFile.addReference(url);
};
const removeImagesReference = (url) => {
  debug('remove ref to %s', url);
  return StorageFile.removeReference(url);
};

exports.addImagesReferences = (doc, fields = []) => {
  if (!_.isArray(fields)) {
    throw new Error('fields must be an array');
  }
  const promiseses = [];
  fields.forEach((field) => {
    const value = _.get(doc, field);
    if (value !== undefined) {
      if (_.isArray(value)) {
        value.forEach(url => promiseses.push(addImagesReference(url)));
      } else {
        promiseses.push(addImagesReference(value));
      }
    }
  });
  return Promise.all(promiseses);
};

exports.deleteImagesReferences = (doc, fields = []) => {
  if (!_.isArray(fields)) {
    throw new Error('fields must be an array');
  }
  const promiseses = [];
  fields.forEach((field) => {
    const value = _.get(doc, field);
    if (value !== undefined) {
      if (_.isArray(value)) {
        value.forEach(url => promiseses.push(removeImagesReference(url)));
      } else {
        promiseses.push(removeImagesReference(value));
      }
    }
  });
  return Promise.all(promiseses);
};
