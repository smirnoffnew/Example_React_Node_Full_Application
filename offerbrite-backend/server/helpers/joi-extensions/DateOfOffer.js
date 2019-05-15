const moment = require('moment');
const validationRules = require('../../validation-rules');

function OfferExtension(joi) {
  return {
    base: joi.date()
      .iso(),
    name: 'dateOfOffer',
    language: {
      format: 'provided string "{{value}}" is not in a format ISO-8601',
      outdated: 'specified date is in the past',
      afterEndDate: '"{{value}}" is after endDate',
      beforeStartDate: '"{{value}}" is before startDate',
      startOutOfInterval: '"{{value}}" is not in {{interval}} interval from the current date',
      endOutOfInterval: '"{{value}}" is not in {{interval}} interval from the startDate',
      anotherMissing: '{{field}} missing, provide it\'s value if you want to update this'
    },
    rules: [
      {
        name: 'isEndDateOfOffer',
        params: joi.object()
          .keys({
            startDate: joi.any()
          }),
        validate(params, value, state, options) {
          if (state.parent.startDate === undefined) {
            return this.createError('dateOfOffer.anotherMissing', { field: 'startDate' }, state, options);
          }
          const date = moment(value, true);
          if (!date.isValid()) {
            return this.createError('dateOfOffer.format', { value }, state, options);
          }
          if (!date.isAfter(moment())) {
            return this.createError('dateOfOffer.outdated', { value }, state, options);
          }
          if (state.parent.startDate) {
            if (!date.isBefore(moment(state.parent.startDate)
              .add(validationRules.offer.endDate.before, 'd'))) {
              return this.createError('dateOfOffer.endOutOfInterval', {
                value,
                interval: `${validationRules.offer.endDate.before} days`
              }, state, options);
            }
            if (date.isBefore(moment(state.parent.startDate))) {
              return this.createError('dateOfOffer.beforeStartDate', { value }, state, options);
            }
          }
          return date.toISOString();
        }
      },
      {
        name: 'isStartDateOfOffer',
        validate(params, value, state, options) {
          if (state.parent.endDate === undefined) {
            return this.createError('dateOfOffer.anotherMissing', { field: 'endDate' }, state, options);
          }
          const date = moment(value, true);
          if (!date.isValid()) {
            return this.createError('dateOfOffer.format', { value }, state, options);
          }
          if (date.isBefore(moment()
            .add(-5, 'm'))) {
            return this.createError('dateOfOffer.outdated', { value }, state, options);
          }
          if (!date.isBefore(moment()
            .add(validationRules.offer.startDate.before, 'd'))) {
            return this.createError('dateOfOffer.startOutOfInterval', {
              value,
              interval: `${validationRules.offer.startDate.before} days`
            }, state, options);
          }
          if (state.parent.endDate) {
            if (date.isAfter(moment(state.parent.endDate))) {
              return this.createError('dateOfOffer.afterEndDate', { value }, state, options);
            }
          }
          return date.toISOString();
        }
      },
    ]
  };
}

module.exports = OfferExtension;
