import { Platform, PermissionsAndroid } from 'react-native';
import parseGooglePlace from 'parse-google-place';
import throwNotification from '@/services/helpers/notification';

export default async function requestLocationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          'title': 'Offerbrite location permission',
          'message': 'Offerbrite App needs access to your geolocation for better user experience',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        throwNotification('Location permission denied');
        return false;
      }
    } catch (error) {
      throwNotification('Location error');
      return false;
    }
  }
}

/**
 * Returns formatted address string without zip code and full location data
 * @param {object} response - Standart response from Places API for Google Places Autocomplete component
 * @returns {object}
 */
export const formatAddress = response => {
  const results = parseGooglePlace(response);
  const location = {
    position: {
      latitude: response.geometry.location.lat,
      longitude: response.geometry.location.lng,
    },
    address: {
      country: results.countryLong,
      state: results.stateLong,
      region: results.county,
      city: results.city,
      street: results.streetName,
      building: results.streetNumber,
    },
  };

  const components = response.address_components;

  if (components[components.length - 1].types.includes('postal_code')) {
    return {
      addressWithoutZIP: response.formatted_address.split(', ').slice(0, -1).join(', '),
      location,
    };
  }
  return {
    addressWithoutZIP: response.formatted_address,
    location,
  };
};

const extractLocationPart = (addressComponents, selector) => {
  const targetPart = addressComponents.filter(component => component.types.includes(selector));
  if (targetPart.length > 0) {
    return targetPart[0].long_name;
  }
  return '';
};

export const formatAddressFromGeocoder = response => {
  const components = response.results[0].address_components;
  const country = extractLocationPart(components, 'country');
  const state = extractLocationPart(components, 'administrative_area_level_1');
  const region = extractLocationPart(components, 'administrative_area_level_2');
  const city = extractLocationPart(components, 'locality');
  const street = extractLocationPart(components, 'route');
  const building = extractLocationPart(components, 'street_number');

  const location = {
    position: {
      latitude: response.results[0].geometry.location.lat,
      longitude: response.results[0].geometry.location.lng,
    },
    address: {
      country,
      state,
      region,
      city,
      street,
      building,
    },
  };

  const addressWithoutZIP = convertAddressDataToString(location.address);

  return {
    addressWithoutZIP,
    location,
  };
};

export const convertAddressDataToString = address => {
  const { building, street, city, state, region, country } = address;
  // building - street - city - state || region - country
  return `${building ? building + ' ' : ''}${street ? street + ', ' : ''}${city ? city + ', ' : ''}${state ? state + ', ' : region ? region + ', ' : ''}${country ? country : ''}`;
};