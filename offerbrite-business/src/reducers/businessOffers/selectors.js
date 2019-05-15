import { createSelector } from 'reselect';

const businessOffers = state => state.businessOffers;

export const liveOffers = createSelector(
  businessOffers,
  businessOffersState => businessOffersState.liveOffers,
);

export const pastOffers = createSelector(
  businessOffers,
  businessOffersState => businessOffersState.pastOffers,
);

export const queryParams = createSelector(
  businessOffers,
  businessOffersState => businessOffersState.queryParams,
);
