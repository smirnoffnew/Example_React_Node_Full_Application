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
    title: 'string',
    description: 'string',
    discount: 'number',
    fullPrice: 'number',
    startDate: {
      type: 'string',
      skipPreCheckEquals: true,
    },
    endDate: {
      type: 'string',
      skipPreCheckEquals: true,
    },
    category: 'string',
    isDateHidden: 'boolean',
    locations: {
      type: 'array',
      items: all.expectLocation
    },
    ownerId: 'string',
    businessId: 'string',
    createdAt: 'string',
    updatedAt: 'string',
    imagesUrls: ['string']
  }
);

const expectEntity = (offer, etaloneFields = {}) => {
  schema.validate(offer);
  schema.checkEquals(offer, etaloneFields);
};

const expectEntityUpdated = (doc, newData) => {
  expectEntity(doc, newData);
};

const expectArrayOfEntities = (offers) => {
  offers.forEach((offer) => {
    expectEntity(offer);
  });
};

module.exports = {
  expectEntity,
  expectEntityUpdated,
  expectArrayOfEntities
};
