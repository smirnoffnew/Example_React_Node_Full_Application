import createReducer from '@/services/helpers/createReducer';
import Types from './types';
import { convertAddressDataToString } from '@/services/helpers/geolocation';

const initialState = {
  newEmail: '',
  newBusiness: {},
  mobileNumbers: [],
  newAddressWithoutZIP: '',
  newLocation: {
    position: null,
    address: null,
  },
  newLogoUrl: '',
};

export default createReducer(initialState, {
  [Types.SET_INITIAL_BUSINESS_FOR_UPDATE]: (state, { payload }) => ({
    ...state,
    ...payload,
    mobileNumbers: payload.newBusiness.mobileNumbers.map(mobileNumber => ({
      callingCode: `+${mobileNumber.cc}`,
      ISOcode: mobileNumber.region,
      number: mobileNumber.number,
    })),
    newAddressWithoutZIP: convertAddressDataToString(payload.newBusiness.locations[0].address),
    newLogoUrl: payload.newBusiness.logoUrl || '',
  }),
  [Types.CHANGE_MOBILE_CODE]: (state, { payload }) => ({
    ...state,
    mobileNumbers: state.mobileNumbers.map((mobileNumber, index) => {
      if (index === payload.index) {
        const newNumber = {
          ISOcode: payload.ISOcode,
          callingCode: payload.callingCode,
          number: mobileNumber.number,
        };
        return newNumber;
      }
      return mobileNumber;
    }),
  }),
  [Types.REMOVE_PHONE_FIELD]: (state, { payload }) => ({
    ...state,
    mobileNumbers: state.mobileNumbers.filter((mobileNumber, index) => index !== payload.index),
  }),
  [Types.ADD_PHONE_FIELD]: (state, { payload }) => ({
    ...state,
    mobileNumbers: state.mobileNumbers.concat({
      ISOcode: state.mobileNumbers[state.mobileNumbers.length - 1].ISOcode,
      callingCode: state.mobileNumbers[state.mobileNumbers.length - 1].callingCode,
      number: '',
    }),
  }),
  [Types.ON_CHANGE_PHONE_VALUE]: (state, { payload }) => ({
    ...state,
    mobileNumbers: state.mobileNumbers.map((mobileNumber, index) => {
      if (index === payload.index) {
        const newNumber = {
          ...mobileNumber,
          number: payload.text,
        };
        return newNumber;
      }
      return mobileNumber;
    }),
  }),
  [Types.SET_NEW_ADDRESS]: (state, { payload }) => ({
    ...state,
    newAddressWithoutZIP: payload.locationData.addressWithoutZIP,
    newLocation: payload.locationData.location,
  }),
  [Types.EDIT_NEW_ADDRESS]: (state, { payload }) => ({
    ...state,
    newAddressWithoutZIP: payload.text,
  }),
  [Types.ERASE_ADDRESS]: (state, { payload }) => ({
    ...state,
    newAddressWithoutZIP: '',
    newLocation: initialState.newLocation,
  }),
});
