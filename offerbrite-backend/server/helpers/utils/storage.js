const storageCtrl = require('../../modules/storage/storage.controller');
const _ = require('lodash');

const addReferencesToImages = (prevDoc, nextDoc, fields) => {
  const diff = _.reduce(fields, (memo, field) => {
    const oldValue = _.get(prevDoc, field);
    const newValue = _.get(nextDoc, field);
    if (newValue !== undefined) {
      if (_.isArray(newValue)) {
        _.set(memo, field, _.difference(newValue, oldValue));
      } else if (oldValue !== newValue && _.isString(newValue) && newValue.length > 0) {
        _.set(memo, field, newValue);
      }
    }
    return memo;
  }, {});
  return storageCtrl.addImagesReferences(diff, Object.keys(diff));
};

const removeReferencesToImages = (prevDoc, nextDoc, fields) => {
  const diff = _.reduce(fields, (memo, field) => {
    const oldValue = _.get(prevDoc, field);
    const newValue = _.get(nextDoc, field);
    if (oldValue !== undefined) {
      if (_.isArray(oldValue)) {
        _.set(memo, field, _.difference(oldValue, newValue));
      } else if (oldValue !== newValue) {
        _.set(memo, field, oldValue);
      }
    }
    return memo;
  }, {});
  return storageCtrl.deleteImagesReferences(diff, Object.keys(diff));
};

exports.updateReferencesToImages = (prevDoc, nextDoc, fields) => Promise.all([
  removeReferencesToImages(prevDoc, nextDoc, fields),
  addReferencesToImages(prevDoc, nextDoc, fields)
]);
