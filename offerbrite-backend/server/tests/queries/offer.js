const httpStatus = require('http-status');
const faker = require('faker');
const validationRules = require('../../validation-rules');
const moment = require('moment');
const { getRandomNumber } = require('../tools');

module.exports.testSuitsForCreation = {
  title: [
    {
      data: {
        title: 'Offerbrite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, solid word'
    },
    {
      data: {
        title: 'O. 2@1Fferb  rite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, several words, contains not-alphanumeric symbols'
    },
    {
      data: {
        title: null
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'empty'
    },
    {
      data: {
        title: Array.from({ length: validationRules.offer.title.min - 1 })
          .map(() => 'a')
          .join('')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `< ${validationRules.offer.title.min} symbols`
    },
    {
      data: {
        title: Array.from({ length: validationRules.offer.title.max + 1 })
          .map(() => 'a')
          .join('')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `> ${validationRules.offer.title.max} symbols`
    },
  ],
  description: [
    {
      data: {
        description: faker.lorem.sentence()
      },
      expectedCode: httpStatus.OK,
      description: 'valid, one sentence'
    },
    {
      data: {
        description: Array.from({ length: validationRules.offer.description.min - 1 })
          .map(() => 'a')
          .join('')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `invalid, < ${validationRules.offer.description.min} symnols`
    },
    {
      data: {
        description: Array.from({ length: validationRules.offer.description.max + 1 })
          .map(() => 'a')
          .join('')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `invalid, > ${validationRules.offer.description.max} symnols`
    },
  ],
  imagesUrls: [
    {
      data: {
        imagesUrls: [faker.internet.url()]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid, random url'
    },
    {
      data: {
        imagesUrls: ['amdlnasocow']
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid, not a url'
    },
    {
      data: {
        imagesUrls: []
      },
      expectedCode: httpStatus.OK,
      description: 'valid, empty array'
    },
    {
      data: {
        imagesUrls: ['https://firebasestorage.googleapis.com/v0/b/test-3f15c.appspot.com/o/c598969c-2108-4bf6-8434-04f35e11dca8']
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid, no such image'
    },
    {
      data: {
        imagesUrls: ['https://firebasestorage.googleapis.com/v0/b/asdfe-3f15c.appspot.com/o/c598969c-2108-4bf6-8434-04f35e11dca8']
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid, not a link to our firebase'
    }
  ],
  'locations.position.latitude': [
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
          },
          position: {
            longitude: 120
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'empty latitude'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
          },
          position: {
            longitude: 120,
            latitude: 120
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '> 90'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
          },
          position: {
            longitude: 120,
            latitude: -120
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '< -90'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
          },
          position: {
            longitude: 120,
            latitude: -90
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '== -90'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
          },
          position: {
            longitude: 120,
            latitude: 90
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '== 90'
    },
  ],
  'locations.position.longitude': [
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
          },
          position: {
            latitude: 50
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'empty longitude'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
          },
          position: {
            longitude: 190,
            latitude: 50
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '> 180'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
          },
          position: {
            longitude: -190,
            latitude: -50
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '< -180'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
          },
          position: {
            longitude: 180,
            latitude: -45
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '== -180'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
          },
          position: {
            longitude: 180,
            latitude: 23
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '== 180'
    },
  ],
  'locations.address': [
    {
      data: {
        locations: [{
          position: {
            longitude: 50,
            latitude: 30
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'no address'
    },
    {
      data: {
        locations: [{
          address: {
            city: 'Kyiv'
          },
          position: {
            longitude: 50,
            latitude: 30
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'no country'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'Ukraine',
            city: 'Kyiv'
          },
          position: {
            longitude: 50,
            latitude: 30
          }
        }]
      },
      expectedCode: httpStatus.OK,
      description: 'valid, create city'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'USA',
            state: 'Utah',
            city: 'Salt Lake City'
          },
          position: {
            longitude: 50,
            latitude: 30
          }
        }]
      },
      expectedCode: httpStatus.OK,
      description: 'valid, create state'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'USA',
            state: 'Utah',
            region: 'CLR',
            city: 'Salt Lake City'
          },
          position: {
            longitude: 50,
            latitude: 30
          }
        }]
      },
      expectedCode: httpStatus.OK,
      description: 'valid, create region'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'USA',
            state: 'Utah',
            region: 'CLR',
            city: 'Salt Lake City',
            streetName: 'Street 12'
          },
          position: {
            longitude: 50,
            latitude: 30
          }
        }]
      },
      expectedCode: httpStatus.OK,
      description: 'valid, create streetName'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'USA',
            state: 'Utah',
            region: 'CLR',
            city: 'Salt Lake City',
            streetName: 'Street 12',
            streetNumber: '125'
          },
          position: {
            longitude: 50,
            latitude: 30
          }
        }]
      },
      expectedCode: httpStatus.OK,
      description: 'valid, create streetNumber'
    },
    {
      data: {
        locations: [{
          address: null,
          position: {
            longitude: 50,
            latitude: 30
          }
        }]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'address is null'
    },
  ],
  'locations.position': [
    {
      data: {
        locations: [{
          address: {
            country: 'Englang'
          },
        }
        ],
      },
      expectedCode: httpStatus.OK,
      description: 'no position'
    }
  ],
  locations: [
    {
      data: {
        locations: []
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid, empty list'
    },
    {
      data: {
        locations: [{
          address: {
            country: 'Germany'
          },
          position: {
            longitude: 50,
            latitude: 30
          }
        },
        {
          address: {
            country: 'England',
            city: 'London'
          },
          position: {
            longitude: -50,
            latitude: -30
          }
        }]
      },
      expectedCode: httpStatus.OK,
      description: 'valid, contains 2 items'
    },
  ],
  category: [
    {
      data: {
        category: 'Offerbrite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, solid word'
    },
    {
      data: {
        category: 'O. 2@1Fferb  rite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, several words, contains not-alphanumeric symbols'
    },
    {
      data: {
        category: null
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'empty'
    },
    {
      data: {
        category: 'n'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '< 2 symbols'
    },
    {
      data: {
        category: Array.from({ length: validationRules.category.name.max + 1 })
          .map(() => 'a')
          .join('')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `> ${validationRules.category.name.max} symbols`
    },
  ],
  fullPrice: [
    {
      data: {
        fullPrice: 1000
      },
      expectedCode: httpStatus.OK,
      description: '> 0 '
    },
    {
      data: {
        fullPrice: -11000
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '< 0'
    },
    {
      data: {
        fullPrice: 0
      },
      expectedCode: httpStatus.OK,
      description: '== 0'
    },
    {
      data: {
        fullPrice: '12.3'
      },
      expectedCode: httpStatus.OK,
      description: 'string with number > 0'
    },
    {
      data: {
        fullPrice: '-12'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'string with number < 0'
    },
    {
      data: {
        fullPrice: '1sdsv2'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'string with not a number'
    },
  ],
  discount: [
    {
      data: {
        discount: 30
      },
      expectedCode: httpStatus.OK,
      description: '0 < x < 100'
    },
    {
      data: {
        discount: -11
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '< 0'
    },
    {
      data: {
        discount: 0
      },
      expectedCode: httpStatus.OK,
      description: '== 0'
    },
    {
      data: {
        discount: 100
      },
      expectedCode: httpStatus.OK,
      description: '== 100'
    },
    {
      data: {
        discount: 101
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: '> 100'
    },
    {
      data: {
        discount: '12.3'
      },
      expectedCode: httpStatus.OK,
      description: 'string with number > 0'
    },
    {
      data: {
        discount: '-12'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'string with number < 0'
    },
    {
      data: {
        discount: '1sdsv2'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'string with not a number'
    },
  ],
  startDate: [
    {
      data: {
        startDate: new Date()
      },
      expectedCode: httpStatus.OK,
      description: 'now'
    },
    {
      data: {
        startDate: moment()
          .add(1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.OK,
      description: '+ 1h'
    },
    {
      data: {
        startDate: moment()
          .add(validationRules.offer.startDate.before, 'day')
          .add(1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `+ ${validationRules.offer.startDate.before} days`
    },
    {
      data: () => ({
        startDate: moment()
          .add(-1, 'm')
          .toISOString()
      }),
      expectedCode: httpStatus.OK,
      description: 'past -1m'
    },
    {
      data: {
        startDate: moment()
          .add(-1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'past -1h'
    },
    {
      data: {
        startDate: moment()
          .add(1, 'hour')
          .format('DD/MM/YYYY hh:mm:ss')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not in format ISO-8601'
    },
    {
      data: {
        startDate: moment()
          .add(1, 'hour')
          .format('DD/MM/YYYY')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not in format ISO-8601'
    },
    {
      data: {
        startDate: moment()
          .add(1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.OK,
      description: 'in format ISO-8601'
    },
    {
      data: {
        startDate: moment()
          .add(3, 'hour')
          .toISOString(),
        endDate: moment()
          .add(1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'startDate > endDate'
    }
  ],
  endDate: [
    {
      data: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 1)
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'now'
    },
    {
      data: {
        endDate: moment()
          .add(1, 'hour')
          .toISOString(),
        startDate: moment()
          .add(1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.OK,
      description: '+ 1h'
    },
    {
      data: {
        startDate: moment()
          .add(1, 'hour')
          .toISOString(),
        endDate: moment()
          .add(validationRules.offer.endDate.before + 1, 'day')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `+ ${validationRules.offer.endDate.before} days after start day`
    },
    {
      data: {
        endDate: moment()
          .add(-1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'past'
    },
    {
      data: {
        endDate: moment()
          .add(25, 'day')
          .format('DD/MM/YYYY hh:mm:ss')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not in format ISO-8601'
    },
    {
      data: {
        endDate: moment()
          .add(25, 'day')
          .format('DD/MM/YYYY')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not in format ISO-8601'
    },
    {
      data: {
        startDate: moment()
          .add(3, 'hour')
          .toISOString(),
        endDate: moment()
          .add(1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'endDate < startDate'
    }
  ],
  anotherField: [
    {
      data: {
        anotherField: 1234
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'all another field is forbidden'
    }
  ]
};

module.exports.testSuitsForUpdating = {
  ...exports.testSuitsForCreation,
  startDate: [
    {
      data: {
        startDate: new Date(),
        endDate: moment()
          .add(25, 'day')
          .toISOString()
      },
      expectedCode: httpStatus.OK,
      description: 'now'
    },
    {
      data: {
        startDate: moment()
          .add(1, 'hour')
          .toISOString(),
        endDate: moment()
          .add(25, 'day')
          .toISOString()
      },
      expectedCode: httpStatus.OK,
      description: '+ 1h'
    },
    {
      data: {
        startDate: moment()
          .add(validationRules.offer.startDate.before, 'day')
          .add(1, 'hour')
          .toISOString(),
        endDate: moment()
          .add(validationRules.offer.startDate.before + 1, 'day')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `+ ${validationRules.offer.startDate.before} days`
    },
    {
      data: {
        startDate: moment()
          .add(-1, 'hour')
          .toISOString(),
        endDate: moment()
          .add(25, 'day')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'past'
    },
    {
      data: {
        startDate: moment()
          .add(1, 'hour')
          .format('DD/MM/YYYY hh:mm:ss'),
        endDate: moment()
          .add(25, 'day')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not in format ISO-8601'
    },
    {
      data: {
        startDate: moment()
          .add(1, 'hour')
          .format('DD/MM/YYYY'),
        endDate: moment()
          .add(25, 'day')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not in format ISO-8601'
    },
    {
      data: {
        startDate: moment()
          .add(1, 'hour')
          .toISOString(),
        endDate: moment()
          .add(25, 'day')
          .toISOString()
      },
      expectedCode: httpStatus.OK,
      description: 'in format ISO-8601'
    },
    {
      data: {
        startDate: moment()
          .add(2, 'hour')
          .toISOString(),
        endDate: moment()
          .add(1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'startDate > endDate'
    }
  ],
  endDate: [
    {
      data: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 1)
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'now'
    },
    {
      data: {
        endDate: moment()
          .add(1, 'hour')
          .toISOString(),
        startDate: moment()
          .add(1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.OK,
      description: '+ 1h'
    },
    {
      data: {
        startDate: moment()
          .add(1, 'hour')
          .toISOString(),
        endDate: moment()
          .add(validationRules.offer.endDate.before + 1, 'day')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `+ ${validationRules.offer.endDate.before} days after start day`
    },
    {
      data: {
        startDate: moment()
          .add(1, 'day')
          .toISOString(),
        endDate: moment()
          .add(-1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'past'
    },
    {
      data: {
        startDate: moment()
          .add(12, 'day')
          .toISOString(),
        endDate: moment()
          .add(25, 'day')
          .format('DD/MM/YYYY hh:mm:ss')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not in format ISO-8601'
    },
    {
      data: {
        startDate: moment()
          .add(12, 'day')
          .toISOString(),
        endDate: moment()
          .add(25, 'day')
          .format('DD/MM/YYYY')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not in format ISO-8601'
    },
    {
      data: {
        startDate: moment()
          .add(2, 'hour')
          .toISOString(),
        endDate: moment()
          .add(1, 'hour')
          .toISOString()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'endDate < startDate'
    }
  ],
};

module.exports.testSuitsForGettingList = {
  title: {
    goodTestSuits: [
      {
        description: 'should return list by title',
        getTestValue: offers => (
          offers[getRandomNumber(offers.length)].title
        ),
        getQuery: value => ({
          title: value
        }),
        countSuitable: (value, offers) => {
          let count = 0;
          const words = value.split(' ');
          for (let i = 0; i < offers.length; i++) {
            let cont = true;
            for (let j = 0; j < words.length && cont; j++) {
              if (offers[i].title.indexOf(words[j]) !== -1) {
                count++;
                cont = false;
              }
            }
          }
          return count;
        }
      }
    ],
    badTestSuits: []
  },
  category: {
    goodTestSuits: [
      {
        description: 'should return list by category',
        getTestValue: offers => (
          offers[getRandomNumber(offers.length)].category
        ),
        getQuery: value => ({
          category: value
        }),
        countSuitable: (value, offers) => {
          let count = 0;
          offers.forEach((offer) => {
            if (offer.category === value) {
              count++;
            }
          });
          return count;
        }
      },
      {
        description: 'should return list by array of categories',
        getTestValue: (offers) => {
          const categories = [];
          const category1 = offers[getRandomNumber(offers.length)].category;
          let category2 = offers[getRandomNumber(offers.length)].category;
          while (category2 === category1) {
            category2 = offers[getRandomNumber(offers.length)].category;
          }
          categories.push(category1, category2);
          return categories;
        },
        getQuery: value => ({
          category: value
        }),
        countSuitable: (value, offers) => {
          let count = 0;
          offers.forEach((offer) => {
            value.forEach((category) => {
              if (offer.category === category) {
                count++;
              }
            });
          });
          return count;
        }
      }
    ],
    badTestSuits: [
      {
        description: 'category is neither string nor array of strings',
        getQuery: () => ({
          category: null
        }),
        expectedCode: httpStatus.BAD_REQUEST
      }
    ]
  },
  ownerId: {
    goodTestSuits: [
      {
        description: 'should return list of offers by owner id',
        getTestValue: offers => (
          offers[getRandomNumber(offers.length)].ownerId
        ),
        getQuery: value => ({
          ownerId: value
        }),
        countSuitable: (value, offers) => {
          let count = 0;
          offers.forEach((offer) => {
            if (offer.ownerId === value) {
              count++;
            }
          });
          return count;
        }
      }
    ],
    badTestSuits: [
      {
        description: 'ownerId is not an ObjectId',
        getQuery: () => ({
          ownerId: null
        }),
        expectedCode: httpStatus.INTERNAL_SERVER_ERROR
      }
    ]
  },
  businessId: {
    goodTestSuits: [
      {
        description: 'should return list of offers by business id',
        getTestValue: offers => (
          offers[getRandomNumber(offers.length)].businessId
        ),
        getQuery: value => ({
          businessId: value
        }),
        countSuitable: (value, offers) => {
          let count = 0;
          offers.forEach((offer) => {
            if (offer.businessId === value) {
              count++;
            }
          });
          return count;
        }
      }
    ],
    badTestSuits: [
      {
        description: 'businessId is not an ObjectId',
        getQuery: () => ({
          businessId: null
        }),
        expectedCode: httpStatus.INTERNAL_SERVER_ERROR
      }
    ]
  },
  location: {
    goodTestSuits: [
      {
        description: 'should return list with near offers',
        getTestValue: () => ({
          loc_latitude: 60,
          loc_longitude: 120,
          loc_radius: 1000000
        }),
        getQuery() {
          return this.getTestValue();
        },
        countSuitable(value, offers) {
          let count = 0;
          for (let i = 0; i < offers.length; i++) {
            const { locations } = offers[i];
            let cont = true;
            for (let j = 0; j < locations.length && cont; j++) {
              const { latitude, longitude } = locations[j].position;
              if (calculateDistanceBetweenTwoPoints(
                latitude,
                longitude,
                value.loc_latitude,
                value.loc_longitude
              )
                <= value.loc_radius) {
                count++;
                cont = false;
              }
            }
          }
          return count;
        }
      }
    ],
    badTestSuits: [
      {
        description: 'loc_longitude < -180',
        getQuery: () => ({
          loc_latitude: 0,
          loc_longitude: -200,
          loc_radius: 0
        }),
        expectedCode: httpStatus.BAD_REQUEST
      },
      {
        description: 'loc_longitude < -180',
        getQuery: () => ({
          loc_latitude: 0,
          loc_longitude: -200,
          loc_radius: 0
        }),
        expectedCode: httpStatus.BAD_REQUEST
      },
      {
        description: 'loc_longitude is not a number',
        getQuery: () => ({
          loc_latitude: 0,
          loc_longitude: null,
          loc_radius: 0
        }),
        expectedCode: httpStatus.BAD_REQUEST
      },
      {
        description: 'loc_latitude > 90',
        getQuery: () => ({
          loc_latitude: 200,
          loc_longitude: 0,
          loc_radius: 0
        }),
        expectedCode: httpStatus.BAD_REQUEST
      },
      {
        description: 'loc_latitude < -90',
        getQuery: () => ({
          loc_latitude: -200,
          loc_longitude: 0,
          loc_radius: 0
        }),
        expectedCode: httpStatus.BAD_REQUEST
      },
      {
        description: 'loc_latitude is not a number',
        getQuery: () => ({
          loc_latitude: null,
          loc_longitude: 0,
          loc_radius: 0
        }),
        expectedCode: httpStatus.BAD_REQUEST
      },
      {
        description: 'loc_radius is not a number',
        getQuery: () => ({
          loc_latitude: 0,
          loc_longitude: 0,
          loc_radius: null
        }),
        expectedCode: httpStatus.BAD_REQUEST
      }
    ]
  }
};

function calculateDistanceBetweenTwoPoints(lat1, lon1, lat2, lon2) {
  const R = 6378.137; // Radius of earth in KM
  const dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  const dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d * 1000; // meters
}
