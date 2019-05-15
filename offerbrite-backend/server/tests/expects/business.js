const all = require('./all');
const ValidationSchema = require('../../helpers/tests/ValidationSchema');

const schema = new ValidationSchema(
  {
    __v: {
      type: 'string',
      forbidden: true
    },
    _id: {
      type: 'string',
      forbidden: true
    },
    id: 'string',
    brandName: 'string',
    locations: {
      type: 'array',
      items: all.expectLocation
    },
    mobileNumbers: {
      skipPreCheckEquals: true,
      type: 'array',
      items: {
        region: 'string',
        number: 'string',
        cc: 'string',
      }
    },
    ownerId: 'string',
    createdAt: 'string',
    updatedAt: 'string',
    logoUrl: {
      optional: true,
      type: 'string',
    },
    websiteUrl: {
      optional: true,
      type: 'string'
    }
  }
);

const expectEntity = (user, etaloneFields = {}) => {
  schema.validate(user);
  schema.checkEquals(user, etaloneFields);
};

const expectEntityUpdated = (doc, newData) => {
  expectEntity(doc, newData);
};

module.exports = {
  expectEntity,
  expectEntityUpdated,
};
