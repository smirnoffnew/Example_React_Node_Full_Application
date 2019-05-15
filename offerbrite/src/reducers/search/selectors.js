import { createSelector } from 'reselect';

const search = state => state.search;

export const categories = createSelector(
  search,
  searchState => searchState.categories,
);

export const selectedCategory = createSelector(
  search,
  searchState => searchState.selectedCategory,
);

export const localOffers = createSelector(
  search,
  searchState => searchState.localOffers,
);

export const selectedOffer = createSelector(
  search,
  searchState => searchState.selectedOffer,
);

export const searchValue = createSelector(
  search,
  searchState => searchState.searchValue,
);

export const searchLocation = createSelector(
  search,
  searchState => searchState.searchLocation,
);

export const results = createSelector(
  search,
  searchState => searchState.results,
);

export const offerLocation = createSelector(
  search,
  searchState => searchState.offerLocation,
);

export const paramsByLocation = createSelector(
  search,
  searchState => searchState.paramsByLocation,
);

export const paramsBySearch = createSelector(
  search,
  searchState => searchState.paramsBySearch,
);
