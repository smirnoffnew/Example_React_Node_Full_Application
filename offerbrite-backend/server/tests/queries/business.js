const httpStatus = require('http-status');
const faker = require('faker');
const validationRules = require('../../validation-rules');

module.exports.testSuitsForUpdating = {
  brandName: [
    {
      data: {
        brandName: 'Offerbrite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, solid word'
    },
    {
      data: {
        brandName: 'O. 2@1Fferb  rite'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, several words, contains not-alphanumeric symbols'
    },
    {
      data: {
        brandName: null
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'empty'
    },
    {
      data: {
        brandName: Array.from({ length: validationRules.business.brandName.min - 1 })
          .map(() => 'a')
          .join('')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `< ${validationRules.business.brandName.min} symbols`
    },
    {
      data: {
        brandName: Array.from({ length: validationRules.business.brandName.max + 1 })
          .map(() => 'a')
          .join('')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `> ${validationRules.business.brandName.max} symbols`
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
        description: Array.from({ length: validationRules.business.description.min - 1 })
          .map(() => 'a')
          .join('')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `invalid, < ${validationRules.business.description.min} symnols`
    },
    {
      data: {
        description: Array.from({ length: validationRules.business.description.max + 1 })
          .map(() => 'a')
          .join('')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `invalid, > ${validationRules.business.description.max} symnols`
    },
  ],
  logoUrl: [
    {
      data: {
        logoUrl: faker.internet.url()
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid, random url'
    },
    {
      data: {
        logoUrl: 'amdlnasocow'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid, not a url'
    },
    {
      data: {
        logoUrl: ''
      },
      expectedCode: httpStatus.OK,
      description: 'valid, empty string'
    },
    {
      data: {
        logoUrl: 'https://firebasestorage.googleapis.com/v0/b/test-3f15c.appspot.com/o/c598969c-2108-4bf6-8434-04f35e11dca8'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid, no such image'
    },
    {
      data: {
        logoUrl: 'https://firebasestorage.googleapis.com/v0/b/asdfe-3f15c.appspot.com/o/c598969c-2108-4bf6-8434-04f35e11dca8'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid, not a link to our firebase'
    }
  ],
  websiteUrl: [
    {
      data: {
        websiteUrl: faker.internet.url()
      },
      expectedCode: httpStatus.OK,
      description: 'valid, random url'
    },
    {
      data: {
        websiteUrl: 'amdlnasocow'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid, not a url'
    },
    {
      data: {
        websiteUrl: ''
      },
      expectedCode: httpStatus.OK,
      description: 'valid, empty string'
    },
    {
      data: {
        websiteUrl: 'www.google.com'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, www.google.com'
    },
    {
      data: {
        websiteUrl: 'http://www.google.com'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, http://www.google.com'
    },
    {
      data: {
        websiteUrl: 'https://www.google.com'
      },
      expectedCode: httpStatus.OK,
      description: 'valid, https://www.google.com'
    },
  ],
  mobileNumbers: [
    {
      data: {
        mobileNumbers: []
      },
      expectedCode: httpStatus.OK,
      description: 'valid, empty array'
    },
    {
      data: {
        mobileNumbers: ['+380500718755']
      },
      expectedCode: httpStatus.OK,
      description: 'valid, valid mobileNumber of UA'
    },
    {
      data: {
        mobileNumbers: Array.from({ length: validationRules.business.mobileNumbers.max + 1 }, () => '+380500718755')
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: `invalid, > ${validationRules.business.mobileNumbers.max} numbers`
    },
    {
      data: {
        mobileNumbers: ['+380300718755']
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'invalid counrty opeator'
    },
    {
      data: {
        mobileNumbers: [1245]
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not a mobile number'
    },
    {
      data: {
        mobileNumbers: ['0500718755']
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'number is out of format'
    },
    {
      data: {
        mobileNumbers: '+380500123456'
      },
      expectedCode: httpStatus.BAD_REQUEST,
      description: 'not a array of mobile number'
    },
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
};

module.exports.testSuitsForCreation = {
  ...exports.testSuitsForUpdating
};
