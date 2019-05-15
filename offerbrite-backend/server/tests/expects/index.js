const all = require('./all');
const user = require('./user');
const storageFile = require('./storageFile');
const category = require('./category');
const businessUser = require('./businessUser');
const business = require('./business');
const offer = require('./offer');

module.exports = {
  ...all,
  offer,
  storageFile,
  business,
  category,
  businessUser,
  user
};
