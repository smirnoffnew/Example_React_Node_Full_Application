/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
require('mongoose-geojson-schema');
const privatePaths = require('../mongoose-plugins/private-paths');
const { toObject, toJSON } = require('../mongoose-plugins/options');

const LocationSchema = mongoose.Schema({
  _position: {
    type: mongoose.Types.Point,
    private: true,
  },
  address: {
    type: {
      country: String,
      state: String,
      region: String,
      city: String,
      streetName: String,
      streetNumber: String
    },
    required: true
  }
});

LocationSchema.set('toJSON', toJSON('_id', 'id', '__v'));
LocationSchema.set('toObject', toObject('_id', 'id', '__v'));

function setPosition(value) {
  this._position = {
    type: 'Point',
    coordinates: [+value.longitude, +value.latitude]
  };
}

function getLocation() {
  if (this._position) {
    return {
      longitude: +this._position.coordinates[0],
      latitude: +this._position.coordinates[1]
    };
  }
  return {};
}

LocationSchema.virtual('position')
  .get(getLocation)
  .set(setPosition);
LocationSchema.plugin(privatePaths);
module.exports = LocationSchema;
