const faker = require('faker');
const config = require('../../config');
const validationRules = require('../validation-rules');
const moment = require('moment');

const randomMobileNumber = () => `+38050${(Array.from({ length: 7 }, () => Math.floor(1 + Math.random() * 9)))
  .join('')}`;
const randomLocation = () => (
  {
    address: {
      country: faker.address.country(),
      city: faker.address.city(),
      streetName: faker.address.streetName(),
      state: faker.address.state()
    },
    position: {
      longitude: -180 + Math.random() * 360,
      latitude: -89.99 + Math.random() * 180
    }
  });

exports.getUserData = () => ({
  username: faker.internet.userName(),
  email: `some.${faker.name.firstName()
    .toLowerCase()}@mail.com`,
  password: '12!@Zulus',
  isNotificationsEnabled: false
});
exports.getAdminData = () => Object.assign({}, config.auth.admin);

exports.getBusinessUserData = () => ({
  email: `some.${faker.name.firstName()
    .toLowerCase()}.bus@mail.com`,
  password: '12!@Business',
  isNotificationsEnabled: false
});
exports.getCategoryData = () => ({
  name: `Category${Math.floor(Math.random() * 999999)}`,
});

exports.getBusinessData = (imageUrl = '') => ({
  brandName: faker.company.companyName()
    .substr(0, validationRules.business.brandName.max),
  description: faker.lorem.sentence(),
  logoUrl: imageUrl,
  mobileNumbers: Array.from({ length: 1 + Math.random() * 4 }, () => randomMobileNumber()),
  locations: Array.from({ length: 1 + Math.random() * 5 }, () => randomLocation()),
  websiteUrl: faker.internet.url(),
});

exports.getOfferData = (imagesUrls = []) => ({
  category: 'food',
  title: faker.commerce.productName()
    .substr(0, validationRules.business.brandName.max),
  description: faker.lorem.sentence(),
  imagesUrls,
  locations: Array.from({ length: 1 + Math.random() * 5 }, () => randomLocation()),
  fullPrice: +faker.commerce.price(),
  discount: Math.random() * 30,
  isDateHidden: faker.random.boolean(),
  startDate: moment()
    .add(1 + Math.random() * 3, 'day')
    .format(),
  endDate: moment()
    .add(5 + Math.random() * 3, 'day')
    .format()
});
