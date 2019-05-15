import { createSelector } from 'reselect';

export const session = state => state.session;

export const tokens = createSelector(
  session,
  sessionState => sessionState.tokens
);

export const user = createSelector(
  session,
  sessionState => sessionState.user
);

export const isAuthenticated = createSelector(
  session,
  sessionState => sessionState.user && sessionState.tokens.access
);
