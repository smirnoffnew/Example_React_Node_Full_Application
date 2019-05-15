/* eslint-disable no-throw-literal */
const _ = require('lodash');

const addressSchema = [{
  field: 'country',
  required: true,
},
  {
    field: 'state',
    required: false,
  }, {
    field: 'region',
    required: false,
  }, {
    field: 'city',
    required: false,
  },
  {
    field: 'streetNumber',
    required: false,
  },
  {
    field: 'streetName',
    required: false,
  }
];
// const positionSchema = [{
//   field: 'latitude',
//   max: 90,
//   min: -90
// }, {
//   field: 'longitude',
//   max: 180,
//   min: -180
// },
// ];

function LocationExtension(joi) {
  return {
    base: joi.object(),
    name: 'object',
    language: {
      noAddressComponent: 'Required field {{field}} is not provided',
      noPositionComponent: 'Required field {{field}} is not provided',
      invalidTypeComponent: 'Field {{field}} is not a {{type}}',
    },
    rules: [
      // {
      //   name: 'isPosition',
      //   validate(params, value, state, options) {
      //     try {
      //       positionSchema.forEach((component) => {
      //         if (!_.has(value, component.field)) {
      //           throw {
      //             errorName: 'object.noPositionComponent',
      //             data: {
      //               field: component.field
      //             }
      //           };
      //         }
      //         const currVal = _.get(value, component.field);
      //         if (!_.isNumber(currVal)) {
      //           throw {
      //             errorName: 'object.invalidTypeComponent',
      //             data: {
      //               field: component.field,
      //               type: 'number'
      //             }
      //           };
      //         }
      //         if (currVal > component.max) {
      //           throw {
      //             errorName: 'object.invalidTypeComponent',
      //             data: {
      //               field: component.field,
      //               type: 'number'
      //             }
      //           };
      //         }
      //       });
      //
      //     } catch (err) {
      //       return this.createError(err.errorName, err.data, state, options);
      //     }
      //   },
      // },
      {
        name: 'isAddress',
        validate(params, value, state, options) {
          try {
            addressSchema.forEach((component) => {
              if (component.required && !_.has(value, component.field)) {
                throw {
                  errorName: 'object.noAddressComponent',
                  data: {
                    field: component.field
                  }
                };
              }
              const currVal = _.get(value, component.field);
              if (currVal && !_.isString(currVal)) {
                throw {
                  errorName: 'object.invalidTypeComponent',
                  data: {
                    field: component.field,
                    type: 'string'
                  }
                };
              }
            });
            return value;
          } catch (err) {
            return this.createError(err.errorName, err.data, state, options);
          }
        }
      },
    ]
  };
}

module.exports = LocationExtension;
