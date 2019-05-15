/* eslint-disable no-await-in-loop */
const Firebase = require('../../server/services/firebase')
  .getClient();
const StorageFile = require('../../server/modules/storage/file.model');
const moment = require('moment');
const debug = require('debug')('app:jobs:images');
const config = require('../../config');
const log = require('../../server/helpers/winston')
  .getLogger({ module });
const _ = require('lodash');

const shouldFileBeDeleted = async (fileName, beforeLimit) => {
  try {
    const file = await StorageFile.findOne({ fileName })
      .select('referencesCount updatedAt');
    return file === null || (file.referencesCount <= 0 && moment(file.updatedAt)
      .isBefore(beforeLimit));
  } catch (err) {
    return true;
  }
};

const processFile = async (fileName, beforeLimit) => {
  if (await shouldFileBeDeleted(fileName, beforeLimit)) {
    debug('%s should be deleted', fileName);
    try {
      await StorageFile.removeByFileName(fileName);
    } catch (err) {
      debug('%s error while delete');
      debug(err);
    }
    return true;
  }
  debug('%s should be leaved', fileName);
  return false;
};

const fetchFiles = async () => {
  let nextQuery = null;
  let countOfDeletedFiles = 0;
  let countOfLeavedFiles = 0;
  const timeLimit = moment()
    .add(-config.uploads.unusedImagesTimeLatency, 'ms');
  do {
    const [files, newNextQuery] = await Firebase
      .storage.getFiles(config.uploads.imagesDir, 10, nextQuery);
    nextQuery = newNextQuery;
    const results = await Promise.all(
      files.map(file => processFile(file.name, timeLimit))
    );
    const { true: _countOfDeletedFiles, false: _countOfLeavedFiles } = _.countBy(results);
    countOfLeavedFiles += _countOfLeavedFiles || 0;
    countOfDeletedFiles += _countOfDeletedFiles || 0;
  } while (nextQuery);
  log.info('processed %s files, deleted: %s, leaved: %s', countOfDeletedFiles + countOfLeavedFiles, countOfDeletedFiles, countOfLeavedFiles);
};

module.exports.exec = () => {
  fetchFiles();
};
