const _ = require('lodash');
const validators = require('./validators');
const errorConverter = require('./errorConverter');
const emailsLettersBuilder = require('./emailLettersBuilder');
const streams = require('./streams');
const scripts = require('./scripts');
const queryProcessors = require('./queryProcessors');
const middlewares = require('./middlewares');
const storage = require('./storage');

const updateObject = (src, doc, path) => {
  if (_.hasIn(src, path)) {
    _.set(doc, path, _.get(src, path));
  }
};
const updateObjectWithReq = (src, doc, paths) => {
  _.forEach(paths, p => updateObject(src, doc, p));
  return doc;
};

module.exports = {
  streams,
  middlewares,
  storage,
  queryProcessors,
  emailsLettersBuilder,
  validators,
  errorConverter,
  scripts,
  updateObjectWithReq
};
