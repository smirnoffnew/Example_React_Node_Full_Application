import { createSelector } from 'reselect';

export const business = state => state.business;

export const addressWithoutZIP = createSelector(
  business,
  businessState => businessState.addressWithoutZIP
);

export const location = createSelector(
  business,
  businessState => businessState.location
);

export const mobileNumber = createSelector(
  business,
  businessState => businessState.mobileNumber
);

export const ISOcode = createSelector(
  business,
  businessState => businessState.ISOcode
);

export const callingCode = createSelector(
  business,
  businessState => businessState.callingCode
);

export const logo = createSelector(
  business,
  businessState => businessState.logo
);

export const businessItem = createSelector(
  business,
  businessState => businessState.businessItem
);

export const addresses = createSelector(
  business,
  businessState => businessState.addresses
);
