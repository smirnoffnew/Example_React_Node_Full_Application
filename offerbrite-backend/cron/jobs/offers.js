/* eslint-disable no-await-in-loop */
const Offer = require('../../server/modules/offer/offer.model');
const moment = require('moment');
const config = require('../../config');
const log = require('../../server/helpers/winston')
  .getLogger({ module });

const fetchOffers = (skip, beforeLimit) => Offer.paginate(
  { endDate: { $lt: beforeLimit } },
  {
    select: 'imagesUrls',
    skip,
    limit: 100
  }
);

module.exports.exec = async () => {
  const beforeLimit = moment()
    .add(-config.offer.timeTolerance, 'ms');
  let skip = 0;
  let totalOffersRemoved = 0;
  let deletedOffers = 0;
  do {
    try {
      const { skip: _skip, docs } = await fetchOffers(skip, beforeLimit);
      skip = _skip;
      deletedOffers = docs.length;
      await Promise.all(docs.map(doc => doc.remove()));
    } catch (err) {
      deletedOffers = 0;
    }
    totalOffersRemoved += deletedOffers;
  } while (deletedOffers !== 0);
  log.info('%s offers were delete', totalOffersRemoved);
};
