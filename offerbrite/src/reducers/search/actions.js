import Types from './types';
import {
  getCategories as apiGetCategories,
  getOffersByUserLocation as apiGetOffersByUserLocation,
  getOfferById as apiGetOfferById,
  getBusinessById as apiGetBusinessById,
  getOffers as apiGetOffers,
} from '@/services/api';
import { actions as requestActions } from '@/reducers/request';
import { actions as favoritesActions } from '@/reducers/favorites';
import { formatOffersData, createLocationTags, createQuery, formatQueryString } from '@/services/helpers/formatData';
import toCapitalize from '@/services/helpers/toCapitalize';
import store from '@/store';

export const getCategories = () => dispatch => {
  dispatch(requestActions.start());
  dispatch({ type: Types.GET_CATEGORIES_START });

  apiGetCategories()
    .then(response => {
      dispatch({
        type: Types.GET_CATEGORIES_SUCCESS,
        payload: { categories: response.data.docs },
      });
      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch({ type: Types.GET_CATEGORIES_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const setCategory = value => ({
  type: Types.SET_CATEGORY,
  payload: { value },
});

export const getOffersByUserLocation = userLocation => (dispatch, getState) => {
  dispatch({ type: Types.SEARCH_BY_USER_LOCATION_START });
  dispatch(requestActions.start());

  if (!userLocation) {
    const { city, state, region, country } = getState().location.userLocation.address;
    userLocation = city || state || region || country;
  }

  const encodedLocation = encodeURIComponent(userLocation);
  const { limit, skip } = getState().search.paramsByLocation;

  apiGetOffersByUserLocation(encodedLocation, limit, skip)
    .then(response => {

      dispatch(favoritesActions.getFavoriteOffers());
      let formattedOffers = formatOffersData(response.data.docs, userLocation);

      dispatch({
        type: Types.SEARCH_BY_USER_LOCATION_SUCCESS,
        payload: { localOffers: formattedOffers },
      });
      dispatch(requestActions.success());
    })
    .catch(error => {
      console.log(error);
      dispatch(requestActions.fail(error));
      dispatch({ type: Types.SEARCH_BY_USER_LOCATION_FAIL });
    });
};

export const getOfferById = offerId => dispatch => {
  dispatch({ type: Types.GET_OFFER_START });
  dispatch(requestActions.start());

  const { favoriteOffers } = store.getState().favorites;

  apiGetOfferById(offerId)
    .then(response => {
      apiGetBusinessById(response.data.businessId)
        .then(businessResponse => {
          let favorite = false;
          favoriteOffers.forEach(offer => {
            if (offer.id === offerId) {
              favorite = true;
            }
          });
          const locationTags = createLocationTags(response.data.locations);

          dispatch({
            type: Types.GET_OFFER_SUCCESS,
            payload: {
              offer: {
                ...response.data,
                business: businessResponse.data,
                tags: [
                  { type: 'category', value: toCapitalize(response.data.category) },
                  ...locationTags,
                ],
                favorite,
              },
            },
          });
          dispatch(requestActions.success());
        })
        .catch(error => {
          dispatch(requestActions.fail(error));
          dispatch({ type: Types.GET_OFFER_FAIL });
        });
    })
    .catch(error => {
      dispatch(requestActions.fail(error));
      dispatch({ type: Types.GET_OFFER_FAIL });
    });
};

export const onChangeSearch = text => ({
  type: Types.ON_CHANGE_SEARCH,
  payload: { text },
});

export const setSearchLocation = locationData => ({
  type: Types.SET_SEARCH_LOCATION_SUCCESS,
  payload: { locationData },
});

export const editSearchAddress = text => ({
  type: Types.EDIT_SEARCH_ADDRESS,
  payload: { text },
});

export const eraseSearchLocation = () => ({
  type: Types.ERASE_SEARCH_LOCATION,
});

export const getOffers = tag => (dispatch, getState) => {
  let query;
  if (tag) {
    if (tag.type === 'location') {
      dispatch(editSearchAddress(tag.value));
      query = { loc_address: tag.value };
    } else if (tag.type === 'category') {
      dispatch(setCategory(tag.value));
      query = { 'category[]': tag.value };
    }
  } else {
    query = createQuery();
  }

  const { limit, skip } = getState().search.paramsBySearch;
  const queryString = formatQueryString(query);
  dispatch({ type: Types.GET_OFFERS_START });

  apiGetOffers(queryString, limit, skip)
    .then(response => {
      const formattedOffers = formatOffersData(response.data.docs, query.loc_address);
      dispatch({
        type: Types.GET_OFFERS_SUCCESS,
        payload: { results: formattedOffers },
      });
      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch(requestActions.fail(error));
      dispatch({ type: Types.GET_OFFERS_FAIL });
    });
};

export const setChosenOfferLocation = location => ({
  type: Types.SET_CHOSEN_OFFER_LOCATION,
  payload: { location },
});

export const onRefreshByLocation = () => ({
  type: Types.REFRESH_BY_LOCATION,
});

export const resetSearchResults = () => ({
  type: Types.RESET_SEARCH_RESULTS,
});
