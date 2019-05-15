/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
require('mongoose-geojson-schema');
const { toObject, toJSON } = require('../mongoose-plugins/options');

const MobileNumberSchema = mongoose.Schema({
  region: {
    type: String,
    required: true
  },
  cc: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
});

MobileNumberSchema.set('toJSON', toJSON('id', '_id', '__v'));
MobileNumberSchema.set('toObject', toObject('_id', 'id', '__v'));

module.exports = MobileNumberSchema;
