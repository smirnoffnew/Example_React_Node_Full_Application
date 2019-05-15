import { createSelector } from 'reselect';

const editProfile = state => state.editProfile;

export const newUsername = createSelector(
  editProfile,
  editProfileState => editProfileState.newUsername,
);

export const newEmail = createSelector(
  editProfile,
  editProfileState => editProfileState.newEmail,
);
