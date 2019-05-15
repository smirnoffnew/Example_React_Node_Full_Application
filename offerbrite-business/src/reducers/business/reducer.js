import createReducer from '@/services/helpers/createReducer';
import Types from './types';
import { convertAddressDataToString } from '@/services/helpers/geolocation';

const initialState = {
  addressWithoutZIP: '',
  location: {
    position: null,
    address: null,
  },
  mobileNumber: '',
  ISOcode: 'US',        // Default country - USA
  callingCode: '+1',    // Default code - USA calling code +1
  logo: {
    data: {
      uri: '',
      type: '',
      name: '',
    },
    imageUrl: '',
  },
  businessItem: {},
  addresses: [],
};

export default createReducer(initialState, {
  [Types.SET_ADDRESS]: (state, { payload }) => ({
    ...state,
    addressWithoutZIP: payload.locationData.addressWithoutZIP,
    location: payload.locationData.location,
  }),
  [Types.EDIT_ADDRESS]: (state, { payload }) => ({
    ...state,
    addressWithoutZIP: payload.text,
  }),
  [Types.ERASE_ADDRESS]: (state, { payload }) => ({
    ...state,
    addressWithoutZIP: '',
    location: initialState.location,
  }),
  [Types.CHANGE_CALLING_CODE]: (state, { payload }) => ({
    ...state,
    ISOcode: payload.ISOcode,
    callingCode: payload.callingCode,
  }),
  [Types.SET_LOGO]: (state, { payload }) => ({
    ...state,
    logo: {
      data: {
        uri: payload.imageData.uri,
        type: payload.imageData.type,
        name: payload.imageData.fileName,
      },
      imageUrl: payload.imageData.uri,
    },
  }),
  [Types.REMOVE_LOGO]: (state, { payload }) => ({ ...state, logo: initialState.logo }),
  [Types.CREATE_BUSINESS_SUCCESS]: (state, { payload }) => ({
    ...state,
    businessItem: payload.business,
    addresses: state.addresses.concat(convertAddressDataToString(payload.business.locations[0].address)),
  }),
  [Types.GET_BUSINESS_SUCCESS]: (state, { payload }) => ({
    ...state,
    businessItem: payload.business,
    addresses: payload.business.locations.map(location => convertAddressDataToString(location.address)),
  }),
  [Types.RESET_BUSINESS]: (state, { payload }) => ({ ...initialState }),
});
