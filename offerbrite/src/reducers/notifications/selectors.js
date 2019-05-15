import { createSelector } from 'reselect';

const notifications = state => state.notifications;

export const operationSystem = createSelector(
  notifications,
  notificationsState => notificationsState.operationSystem,
);

export const token = createSelector(
  notifications,
  notificationsState => notificationsState.token,
);

export const isTokenSetSuccessfully = createSelector(
  notifications,
  notificationsState => notificationsState.isTokenSetSuccessfully,
);
