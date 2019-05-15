const rulesForCategory = require('./category');
const config = require('../../config/index');

module.exports = {
  maxCountOfBusinessPerUser: 1,
  brandName: {
    regExp: /.+/,
    min: 2,
    max: 30
  },
  description: {
    regExp: /.+/,
    min: config.isProduction ? 100 : 5,
    max: 1000
  },
  mobileNumbers: {
    min: 0,
    max: 10,
  },
  locations: {
    min: 1,
    max: 10,
  },
  category: rulesForCategory.name
};
