const _ = require('lodash');
const moment = require('moment');
const OfferLocation = require('./offerLocation.model');

/**
 * Extracts specified query option from received query
 * @param {object} query -  received query
 * @param {string} field - name of field
 * @param {string} bindTo - name of field where value should be added
 * @return {object} part of query option for mongoose search including category
 */
const extractStringOrArray = (query, field, bindTo) => {
  if (!bindTo) {
    bindTo = field;
  }
  if (query[field] !== undefined) {
    if (_.isArray(query[field])) {
      return { [bindTo]: { $in: query[field] } };
    }
    if (_.isString(query[field])) {
      return { [bindTo]: query[field].toLowerCase() };
    }
    return { [bindTo]: query[field] };
  }
  return {};
};
/**
 * returns query part for active offers, include startDate and endDate
 * @return {{startDate: {$lte: number}, endDate: {$gte: number}}}
 */
const getQueryForActiveOffers = () => ({
  startDate: {
    $lte: moment()
      .add('10', 's')
      .valueOf()
  },
  endDate: {
    $gte: moment()
      .add('10', 's')
      .valueOf()
  }
});
/**
 * returns query part for past offers, include startDate and endDate
 * @return {{startDate: {$lte: number}, endDate: {$gte: number}}}
 */
const getQueryForPastOffers = () => ({
  endDate: {
    $lte: moment()
      .add('10', 's')
      .valueOf()
  }
});
/**
 * returns query part for deferred offers, include startDate and endDate
 * @return {{startDate: {$lte: number}, endDate: {$gte: number}}}
 */
const getQueryForDeferredOffers = () => ({
  startDate: {
    $gte: moment()
      .add('10', 's')
      .valueOf()
  },
});
/**
 * Extracts category option from query
 * @param {object} query -  received query
 * @return {object} part of query option for mongoose search including category
 */
const extractStatus = (query) => {
  switch (query.status) {
    case 'all':
      return {};
    case 'past':
      return getQueryForPastOffers();
    case 'deferred':
      return getQueryForDeferredOffers();
    default:
    case 'active':
      return getQueryForActiveOffers();
  }
};
/**
 * Extracts search by text index from query
 * @param {object} query -  received query
 * @return {object} part of query option for mongoose search
 */
const extractTextSearch = (query) => {
  let searchString = '';
  ['title'].forEach((field) => {
    if (query[field] !== undefined) {
      if (_.isString(query[field])) {
        searchString += query[field];
      } else if (_.isArray(query[field])) {
        searchString += query[field].join(' ');
      }
    }
  });
  if (searchString.length > 0) {
    return {
      $text: {
        $search: searchString,
        $caseSensitive: false
      }
    };
  }
  return {};
};
/**
 * Extracts address option from query
 * @param {object} query -  received query
 * @return {object} part of query option for mongoose search
 */
const extractLocAddress = (query) => {
  if (_.isString(query.loc_address)) {
    return {
      $text: {
        $search: query.loc_address,
        $caseSensitive: false
      }
    };
  }
  return {};
};
/**
 * Extracts position option from query
 * @param {object} query -  received query
 * @return {object} part of query option for mongoose search
 */
const extractLocPosition = (query) => {
  if (
    _.isNumber(query.loc_latitude)
    && _.isNumber(query.loc_longitude)
    && _.isNumber(query.loc_radius)
  ) {
    return {
      'loc._position': {
        $near: {
          $maxDistance: query.loc_radius,
          $geometry: {
            type: 'Point',
            coordinates: [query.loc_longitude, query.loc_latitude]
          }
        }
      }
    };
  }
  return {};
};
/**
 * Extracts location option from query
 * @param {object} query -  received query
 * @return {object} part of query option for mongoose search, include _id
 */
const extractLocation = async (query) => {
  const offerLocationQuery = {
    ...extractLocAddress(query),
    ...extractLocPosition(query)
  };
  if (Object.keys(offerLocationQuery).length > 0) {
    const ids = (await OfferLocation.find(offerLocationQuery)
      .select({
        _id: 1,
        offerId: 1
      })).map(doc => doc.offerId);
    return { _id: { $in: ids } };
  }
  return {};
};


/**
 * process received query object and returns MongoDB query
 * @param {Express.Query} query - query received query
 * @return {{category: *}}
 */
const process = async query => ({
  ...extractTextSearch(query),
  ...extractStatus(query),
  ...await extractLocation(query),
  ...extractStringOrArray(query, 'category'),
  ...extractStringOrArray(query, 'ownerId'),
  ...extractStringOrArray(query, 'businessId'),
  ...extractStringOrArray(query, 'isDateHidden'),

});
module.exports = { process };
