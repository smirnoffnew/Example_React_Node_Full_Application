import createReducer from '@/services/helpers/createReducer';
import Types from './types';

const initialState = {
  userLocation: {
    addressWithoutZIP: '',
    position: {
      latitude: null,
      longitude: null,
    },
    address: {},
  },
};

export default createReducer(initialState, {
  [Types.GET_USER_LOCATION_SUCCESS]: (state, { payload }) => ({
    ...state,
    userLocation: {
      addressWithoutZIP: payload.locationData.addressWithoutZIP,
      ...payload.locationData.location,
    }
  }),
  [Types.SET_USER_LOCATION_SUCCESS]: (state, { payload }) => ({
    ...state,
    userLocation: {
      addressWithoutZIP: payload.locationData.addressWithoutZIP,
      ...payload.locationData.location,
    },
  }),
  [Types.EDIT_USER_ADDRESS]: (state, { payload }) => ({
    ...state,
    userLocation: {
      ...state.userLocation,
      addressWithoutZIP: payload.text,
    },
  }),
  [Types.ERASE_LOCATION]: (state, { payload }) => ({
    ...state,
    userLocation: initialState.userLocation,
  }),
});
