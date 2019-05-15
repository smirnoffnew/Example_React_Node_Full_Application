const debug = require('debug')('app:firebase:storage');
const log = require('../winston')
  .getLogger({ name: 'firebase:storage' });
const urlParse = require('url-parse');
const APIError = require('../APIError');
const httpStatus = require('http-status');
const querystring = require('querystring');

const regexForAppId = /\/b\/(.*)\/o\//;
const regexForFileId = /\/o\/(.*)$/;
const hostName = 'firebasestorage.googleapis.com';

/**
 * @typedef Storage
 */
class Storage {
  /**
   * Builds Storage file
   * @param {string} projectId id of firebase project
   * @param {*} storage Google Cloud Storage
   * @param {string} bucketName name of bucket to use
   */
  constructor(projectId, storage, bucketName) {
    this._storage = storage;
    this._projectId = projectId;
    this._bucketName = bucketName;
    this._bucket = storage.bucket(bucketName);
    debug('new storage created');
  }

  getFilePublicLink(fileName) {
    return `https://firebasestorage.googleapis.com/v0/b/${this.bucketName}/o/${querystring.escape(fileName)}?alt=media`;
  }

  /**
   * Calculates size of storage in bytes
   * @param {String} prefix prefix to search files
   * @returns {Promise<Number>} size of files in bytes
   */
  async storageInBytes(prefix) {
    try {
      const files = await this.bucket.getFiles({ prefix });
      if (!files || !files.length) {
        return 0;
      }
      const size = files[0].map(file => Number(file.metadata.size))
        .reduce((a, b) => a + b, 0);
      log.info('size of storage[%s] = %d', prefix, size);
      return size;
    } catch (err) {
      return 0;
    }
  }

  get bucketName() {
    return this._bucketName;
  }

  get storage() {
    return this._storage;
  }

  get bucket() {
    return this._bucket;
  }

  /**
   * Uploads file to Firebase storage using steam with file
   * @param {String} dir path to dir to save file
   * @param {String} fileName name of file to save
   * @param {Stream} stream str
   * @param {Object} options options to pass firebase
   */
  uploadWithStream(dir, fileName, stream, options = {}) {
    const file = this.bucket.file(`${dir}/${fileName}`);
    return new Promise((resolve, reject) => {
      stream
        .pipe(file.createWriteStream(options))
        .on('error', reject)
        .on('finish', () => {
          log.info('file %s [%db] uploaded', file.name, file.metadata.size);
          file.getSignedUrl({
            action: 'read',
            expires: '03-17-2050'
          })
            .then(links => resolve(links[0]));
        });
    });
  }

  /**
   * Uploads local saved file to Firebase storage
   * @param {String} dir path to dir to save file
   * @param {String} fileName name of file to save
   * @param {String} path to file
   * @param {Object} options options to pass firebase
   */
  uploadWithPath(dir, fileName, pathToFile, options = {}) {
    return this.bucket.upload(pathToFile, {
      ...options,
      destination: `${dir}/${fileName}`
    })
      .then(async ([file]) => {
        log.info('file %s [%db] uploaded', file.name, file.metadata.size);
        file.publicLink = this.getFilePublicLink(file.name);
        return file;
      })
      .catch((err) => {
        log.error('file %s was not uploaded', fileName);
        throw err;
      });
  }

  /**
   * Deletes file from Firebase storage
   * @param {string} fileName name of file to delete
   * @returns {Promise<DeleteFileResponse>} Firebase delete file response
   */
  deleteFile(fileName) {
    const file = this.bucket.file(fileName);
    return file.delete()
      .then((result) => {
        log.info('file %s deleted', file.name);
        return result;
      })
      .catch((err) => {
        log.error('file %s was not deleted, in case %s', file.name, err);
        return null;
      });
  }

  get projectId() {
    return this._projectId;
  }

  /**
   * Returns filename, encoded in url
   * @param {string} url - url of file
   * @return {string} filename, saved at Firebase
   */
  decodeUrl(url) {
    const decoded = urlParse(querystring.unescape(url));
    if (decoded.hostname !== hostName) {
      throw new APIError('Provided url is not an url of Firebase resource', httpStatus.BAD_REQUEST, true);
    } else if (regexForAppId.exec(decoded.pathname)[1] !== this.bucketName) {
      throw new APIError('Provided url is not an url of this Firebase project', httpStatus.BAD_REQUEST, true);
    } else if (!regexForFileId.test(decoded.pathname)) {
      throw new APIError('Provided url does not contain file ID', httpStatus.BAD_REQUEST, true);
    }
    return regexForFileId.exec(decoded.pathname)[1];
  }

  /**
   * Deletes file from Firebase by it's public url
   * @param {string} url - url of file
   * @return {Promise<DeleteFileResponse>}
   */
  deleteFileByUrl(url) {
    const filename = this.decodeUrl(url);
    return this.deleteFile(filename);
  }

  /**
   * Checks, is url can be a link to saved file
   * @param {string} url - url of file
   * @return {boolean} true, if url is valid
   */
  isValidFileUrl(url = '') {
    try {
      this.decodeUrl(url);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Check, is file linked by url exist at storage
   * @param {string} url - url of file
   * @return {Promise<true>} true, if file exist
   */
  isUrlLinksToExistingFile(url = '') {
    try {
      const filename = this.decodeUrl(url);
      return this.isFileExists(filename);
    } catch (e) {
      return false;
    }
  }

  /**
   * Checks, is file exist at storage
   * @param {string} filename - name of file
   * @return {Promise<true>} true, if file exist
   */
  isFileExists(filename) {
    const file = this.bucket.file(filename);
    return file.exists()
      .then(data => !!data[0]);
  }

  clear(prefix) {
    return this.bucket.deleteFiles({
      prefix,
      force: true
    });
  }

  getFiles(prefix, maxResults = 50, nextQuery) {
    if (nextQuery) {
      return this.bucket.getFiles(nextQuery);
    }
    return this.bucket.getFiles({
      prefix,
      maxResults,
      autoPaginate: true,
    });
  }
}

module.exports = Storage;
