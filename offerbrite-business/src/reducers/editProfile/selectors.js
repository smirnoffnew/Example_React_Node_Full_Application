import { createSelector } from 'reselect';

const editProfile = state => state.editProfile;

export const newBusiness = createSelector(
  editProfile,
  editProfileState => editProfileState.newBusiness,
);

export const newEmail = createSelector(
  editProfile,
  editProfileState => editProfileState.newEmail,
);

export const mobileNumbers = createSelector(
  editProfile,
  editProfileState => editProfileState.mobileNumbers,
);

export const newAddressWithoutZIP = createSelector(
  editProfile,
  editProfileState => editProfileState.newAddressWithoutZIP,
);

export const newLocation = createSelector(
  editProfile,
  editProfileState => editProfileState.newLocation,
);

export const newLogoUrl = createSelector(
  editProfile,
  editProfileState => editProfileState.newLogoUrl,
);
