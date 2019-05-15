import parseGooglePlace from 'parse-google-place';

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

/**
 * Returns formatted string that contains all available address parts
 * @param {object} address - Parsed address object from DB
 * @returns {string}
 */
export const convertAddressDataToString = address => {
  const { building, street, city, state, region, country } = address;
// building - street - city - state || region - country
// Davyda Oistrakha St, Odesa, Odes'ka oblast, Ukraine
  return `${building ? building + ' ' : '' }${street ? street + ', ' : ''}${city ? city + ', ' : ''}${state ? state + ', ' : region ? region + ', ' : ''}${country ? country : ''}`;
};
