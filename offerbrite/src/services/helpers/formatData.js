import store from '@/store';
import { GA_trackSearch } from '@/services/analytics';

/**
 * Returns data object converted in FormData object
 * @param {object} data - Data which will be converted in FormData object
 * @param {string} excludeKey - Identifier which won't be included in final formdata object
 * @returns {FormData}
 */
export const makeFormData = (data, excludeKey = null) => {
  let formData = new FormData();

  for (let [key, value] of Object.entries(data)) {
    if (key !== excludeKey) {
      formData.append(`${key}`, `${value}`);
    }
  }

  return formData;
};

/**
 * Parses offers response and converts locations property to have a single element in array
 * @param {array} offers - Response from GET request that contain array of offer objects
 * @param {string} targetLocation - Location selector which will be shown in UI for every single offer
 * @returns {array}
 */
export const formatOffersData = (offers, targetLocation) => {
  const formattedOffers = offers.map(offer => {

    let locations;
    if (targetLocation) {
      locations = offer.locations.filter(location => {
        for (let value of Object.values(location.address)) {
          if (value === targetLocation) {
            return location;
          }
        }
      });
    } else {
      locations = offer.locations;
    }

    return {
      ...offer,
      locations,
      favorite: false,
    };
  });

  return formattedOffers;
};

export const addFavoriteProperty = (currentOffers, favoriteOffers) => {
  let comparison = [];

  return currentOffers.map(offer => {
    comparison = favoriteOffers.filter(favorite => offer.id === favorite.id);
    return {
      ...offer,
      favorite: comparison.length > 0 ? true : false,
    };
  });
};

export const createLocationTags = locations => locations.map(location => {
  const { city, state, region, country } = location.address;
  const locationTag = city || state || region || country;
  return {
    type: 'location',
    value: locationTag,
  };
});

export const createQuery = () => {
  const { search } = store.getState();
  const { position, address } = search.searchLocation;
  let locationKeyWord = '';

  if (position.latitude && position.longitude) {
    const { city, state, region, country } = address;
    locationKeyWord = city || state || region || country;
  }
  return {
    title: search.searchValue,
    'category[]': search.selectedCategory === 'Category' || search.selectedCategory === 'All' ?
      '' :
      search.selectedCategory,
    loc_address: locationKeyWord,
  };
};

export const formatQueryString = query => {
  let queryString = '';

  for (let [key, value] of Object.entries(query)) {
    if (value !== '') {
      GA_trackSearch(key, value);
      queryString += `${key}=${encodeURIComponent(value.toLowerCase())}&`;
    }
  }

  return queryString.slice(0, -1);
};
