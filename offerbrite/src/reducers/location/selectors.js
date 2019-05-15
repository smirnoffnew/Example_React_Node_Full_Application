import { createSelector } from 'reselect';

const location = state => state.location;

export const userLocation = createSelector(
  location,
  locationState => locationState.userLocation,
);
