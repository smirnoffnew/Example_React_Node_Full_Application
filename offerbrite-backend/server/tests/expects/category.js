const ValidationSchema = require('../../helpers/tests/ValidationSchema');

const schema = new ValidationSchema({
  __v: {
    type: 'string',
    forbidden: true
  },
  _id: {
    type: 'string',
    forbidden: true
  },
  id: 'string',
  name: 'string',
});

const expectEntity = (cat, etaloneFields = {}) => {
  schema.validate(cat);
  schema.checkEquals(cat, etaloneFields);
};
const expectEntityUpdated = (doc, newData) => {
  expectEntity(doc, newData);
};

module.exports = {
  expectEntity,
  expectEntityUpdated,
};
