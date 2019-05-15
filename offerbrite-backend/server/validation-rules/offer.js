const rulesForCategory = require('./category');
const config = require('../../config/index');

module.exports = {
  title: {
    regExp: /.+/,
    min: 3,
    max: 50
  },
  description: {
    regExp: /.+/,
    min: config.isProduction ? 30 : 5,
    max: 1000
  },
  locations: {
    min: 1,
    max: 100,
  },
  imagesUrls: {
    max: 10,
    min: 0
  },
  startDate: {
    before: 30,
  },
  endDate: {
    before: 31
  },
  category: rulesForCategory.name
};
