const User = require('../../modules/user/user.model');
const BusinessUser = require('../../modules/business-user/businessUser.model');
const Business = require('../../modules/business/business.model');
const Category = require('../../modules/category/category.model');
const Offer = require('../../modules/offer/offer.model');
const FavouriteOffers = require('../../modules/favouriteOffers/favouriteOffer.model');
const log = require('../winston')
  .getLogger({ module });
const usersData = require('./usersData');
const businessUsersData = require('./businessUsersData');
const StorageFile = require('../../modules/storage/file.model');
const Firebase = require('../../services/firebase')
  .getClient();

async function fillUserDB() {
  const users = await Promise.all(usersData.map(x => new User(x).save()));
  await users[0].update({ additionalInfo: { isEmailConfirmed: true } });
  log.debug(`fill users db with ${users.length} docs`);
  return users;
}

async function fillBusinessUserDB() {
  const users = await Promise.all(businessUsersData.map(x => new BusinessUser(x).save()));
  await users[0].update({ additionalInfo: { isEmailConfirmed: true } });
  log.debug(`fill businessUsers db with ${users.length} docs`);
  return users;
}

function fillAllDBs() {
  return clearAllDBs()
    .then(() => fillUserDB())
    .then(() => fillBusinessUserDB());
}


function clearFavouriteOffersDB() {
  return FavouriteOffers.deleteMany();
}

function clearStorageFileDB() {
  return StorageFile.deleteMany();
}

function clearUserDB() {
  return User.deleteMany();
}

function clearBusinessDB() {
  return Business.deleteMany();
}

function clearOfferDB() {
  return Offer.deleteMany();
}

function clearBusinessUserDB() {
  return BusinessUser.deleteMany();
}

function clearCategoryDB() {
  return Category.deleteMany();
}

function clearStorage() {
  return Firebase.storage.clear();
}

function clearAllDBs() {
  log.debug('clear all DBs');
  return Promise.all([
    clearStorage(),
    clearUserDB(),
    clearBusinessUserDB(),
    clearCategoryDB(),
    clearBusinessDB(),
    clearOfferDB(),
    clearFavouriteOffersDB(),
    clearStorageFileDB()
  ]);
}

module.exports = {
  clearFavouriteOffersDB,
  clearBusinessDB,
  clearStorageFileDB,
  fillAllDBs,
  clearStorage,
  clearCategoryDB,
  fillUserDB,
  clearUserDB,
  clearBusinessUserDB,
  clearAllDBs,
  clearOfferDB
};
