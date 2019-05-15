import types from './types';

import {
  getOffers as apiGetOffers,
  getOfferById as apiGetOfferById,
  getCategories as apiGetCategories,
  deleteOffer as apiDeleteOffer,
  getBusinessById as apiGetBusinessById,
  updateOffer as apiUpdateOffer,
} from 'services/api';

import { actions as requestActions } from 'reducers/request';
import { setInitialCategories } from 'reducers/notificationForm/actions';

export const getOffers = () => async (dispatch, getState) => {
  dispatch(requestActions.start());
  dispatch({ type: types.GET_OFFERS_START });

  try {
    const response = await apiGetOffers();
    dispatch(requestActions.success());
    dispatch({ type: types.GET_OFFERS_SUCCESS, payload: { offersList: response.data.data } });
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.GET_OFFERS_FAIL });
  }
};

export const getOfferById = offerId => async (dispatch, getState) => {
  dispatch(requestActions.start());
  dispatch({ type: types.GET_OFFER_BY_ID_START });

  try {
    const response = await apiGetOfferById(offerId);
    if (response.data.status === 'OK') {
      console.log(response.data.data);
      const business = await apiGetBusinessById(response.data.data.businessId);
      if (business.data.status === 'OK') {
        dispatch({
          type: types.GET_OFFER_BY_ID_SUCCESS,
          payload: {
            ...response.data.data,
            business: business.data.data,
          },
        });
        dispatch(requestActions.success());
      }
    }
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.GET_OFFER_BY_ID_FAIL });
  }
};

export const onChangeOfferFormField = (e, fieldTitle) => ({
  type: types.ON_CHANGE_OFFER_FORM_FIELD,
  payload: { fieldTitle, text: e.target.value },
});

export const onChangeOfferCategory = category => ({
  type: types.ON_CHANGE_CATEGORY,
  payload: { category },
});

export const getCategories = () => async dispatch => {
  dispatch({ type: types.GET_CATEGORIES_START });

  try {
    const response = await apiGetCategories();
    if (response.data.docs) {
      dispatch({ type: types.GET_CATEGORIES_SUCCESS, payload: { categories: response.data.docs } });
      dispatch(setInitialCategories(response.data.docs));
    }
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.GET_CATEGORIES_FAIL });
  }
};

export const deleteOffer = offerId => async dispatch => {
  dispatch(requestActions.start());
  dispatch({ type: types.DELETE_OFFER_START });

  try {
    const response = await apiDeleteOffer(offerId);
    if (response.data.status === 'OK') {
      dispatch(getOffers());
    }
    dispatch(requestActions.success());
    dispatch({ type: types.DELETE_OFFER_SUCCESS });
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.DELETE_OFFER_FAIL });
  }
};

export const filterOffersByCategory = category => (dispatch, getState) => {
  const { offersList, selectedCountry } = getState().offers;

  const filteredData = offersList.filter(offer => {
    if (selectedCountry) {
      return offer.category === category.toLowerCase() &&
        offer.locations[0].address.country === selectedCountry;
    }
    return offer.category === category.toLowerCase()
  });

  dispatch({
    type: types.FILTER_OFFERS_BY_CATEGORY,
    payload: { category, filteredData },
  });
};

export const filterOffersByCountry = country => (dispatch, getState) => {
  const { offersList, selectedCategory } = getState().offers;

  const filteredData = offersList.filter(offer => {
    const offerCountry = offer.locations[0].address.country;
    if (selectedCategory) {
      return offer.category === selectedCategory.toLowerCase() &&
        offerCountry === country;
    }
    return offerCountry === country;
  });

  dispatch({
    type: types.FILTER_OFFERS_BY_COUNTRY,
    payload: { country, filteredData },
  });
};

export const filterOffersBySearch = e => (dispatch, getState) => {
  const { offersList, selectedCategory, selectedCountry } = getState().offers;

  const searchTarget = e.target.value.toLowerCase();
  const filteredData = offersList.filter(offer => {
    const lowerTitle = offer.title.toLowerCase();
    const offerCountry = offer.locations[0].address.country;
    if (selectedCategory && selectedCountry) {
      return offer.category === selectedCategory.toLowerCase() &&
        offerCountry === selectedCountry &&
        (lowerTitle.includes(searchTarget) || offer.id.includes(searchTarget));
    } else if (selectedCategory) {
      return offer.category === selectedCategory.toLowerCase() &&
        (lowerTitle.includes(searchTarget) || offer.id.includes(searchTarget));
    } else if (selectedCountry) {
      return offerCountry === selectedCountry &&
        (lowerTitle.includes(searchTarget) || offer.id.includes(searchTarget));
    }
    return lowerTitle.includes(searchTarget) || offer.id.includes(searchTarget);
  });

  dispatch({
    type: types.FILTER_OFFERS_BY_SEARCH,
    payload: { filteredData }
  });
};

export const turnOffOffersFilter = () => ({
  type: types.TURN_OFF_OFFERS_FILTER,
});

export const resetOfferToUpdate = () => ({
  type: types.RESET_OFFER_TO_UPDATE,
});

export const updateOffer = () => async (dispatch, getState) => {
  const { offerToUpdate } = getState().offers;
  const data = {
    ...offerToUpdate,
    discount: offerToUpdate.discount || 0,
    fullPrice: offerToUpdate.discount || 0,
  };
  dispatch({ type: types.UPDATE_OFFER_START });

  try {
    const response = await apiUpdateOffer(offerToUpdate.id, data);
    if (response.data.status === 'OK') {
      dispatch(getOffers());
      dispatch({ type: types.UPDATE_OFFER_SUCCESS });
    }
  } catch (error) {
    console.log(error.response);
    dispatch({ type: types.UPDATE_OFFER_FAIL });
  }
};
