import { createSelector } from 'reselect';

const request = state => state.request;

export const notification = createSelector(
  request,
  requestState => requestState.notification,
);

export const loading = createSelector(
  request,
  requestState => requestState.loading,
);
