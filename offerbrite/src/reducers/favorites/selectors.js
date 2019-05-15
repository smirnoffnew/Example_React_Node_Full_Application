import { createSelector } from 'reselect';

const favorites = state => state.favorites;

export const favoriteOffers = createSelector(
  favorites,
  favoritesState => favoritesState.favoriteOffers,
);
