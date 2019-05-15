const user = require('./user');
const offer = require('./offer');
const category = require('./category');
const businessUser = require('./businessUser');
const business = require('./business');
const storage = require('./storage');
const favouriteOffers = require('./favouriteOffers');

module.exports = {
  favouriteOffers,
  category,
  storage,
  businessUser,
  business,
  offer,
  user
};
