import { createSelector } from 'reselect';

export const offer = state => state.offer;

export const places = createSelector(
  offer,
  offerState => offerState.places
);

export const description = createSelector(
  offer,
  offerState => offerState.description
);

export const startDate = createSelector(
  offer,
  offerState => offerState.startDate
);

export const endDate = createSelector(
  offer,
  offerState => offerState.endDate
);

export const isDateHidden = createSelector(
  offer,
  offerState => offerState.isDateHidden
);

export const categories = createSelector(
  offer,
  offerState => offerState.categories,
);

export const selectedCategory = createSelector(
  offer,
  offerState => offerState.selectedCategory,
);

export const image = createSelector(
  offer,
  offerState => offerState.image,
);

export const newOffer = createSelector(
  offer,
  offerState => offerState.newOffer,
);
