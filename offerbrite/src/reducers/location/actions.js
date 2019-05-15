import Types from './types';
import { GOOGLE_API_KEY } from 'react-native-dotenv';
import Geocoder from 'react-native-geocoding';
import { formatAddressFromGeocoder } from '@/services/helpers/geolocation';
import throwNotification from '@/services/helpers/notification';
import { actions as searchActions } from '@/reducers/search';
import { saveUserCountry } from '@/services/api';
import store from '@/store';

Geocoder.init(GOOGLE_API_KEY);

const getLocationSuccess = (position, dispatch) => {
  const coords = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };

  Geocoder.from(coords)
    .then(response => {
      const locationData = formatAddressFromGeocoder(response);
      dispatch({
        type: Types.GET_USER_LOCATION_SUCCESS,
        payload: { locationData },
      });
      const { city, state, region, country } = locationData.location.address;
      const keyWord = city || state || region || country;
      if (country) {
        const { user } = store.getState().session;
        saveUserCountry(user.id, { country });
      }

      dispatch(searchActions.getOffersByUserLocation(keyWord));
    })
    .catch(error => {
      dispatch({ type: Types.GET_USER_LOCATION_FAIL });
      throwNotification(error.message);
    });
};

const getLocationFail = (error, dispatch) => {
  dispatch({ type: Types.GET_USER_LOCATION_FAIL });
  throwNotification(error.message);
};

export const getUserLocation = () => dispatch => {
  dispatch({ type: Types.GET_USER_LOCATION_START });

  navigator.geolocation.getCurrentPosition(
    (position) => getLocationSuccess(position, dispatch),
    (error) => getLocationFail(error, dispatch),
    { enableHighAccuracy: false, timeout: 600000, maximumAge: 3600000 },
  );
};

export const setUserLocation = locationData => dispatch => {
  const { city, state, region, country } = locationData.location.address;
  const keyWord = city || state || region || country;

  dispatch(searchActions.getOffersByUserLocation(keyWord));
  dispatch({
    type: Types.SET_USER_LOCATION_SUCCESS,
    payload: { locationData },
  });
};

export const editUserAddress = text => ({
  type: Types.EDIT_USER_ADDRESS,
  payload: { text },
});

export const eraseLocation = () => ({
  type: Types.ERASE_LOCATION,
});
