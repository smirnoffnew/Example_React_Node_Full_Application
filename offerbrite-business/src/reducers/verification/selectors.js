import { createSelector } from 'reselect';

export const verification = state => state.verification;

export const photos = createSelector(
  verification,
  verificationState => verificationState.photos
);

export const comment = createSelector(
  verification,
  verificationState => verificationState.comment
);
