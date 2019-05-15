import createReducer from '@/services/helpers/createReducer';
import Types from './types';

const initialState = {
  categories: ['All'],
  selectedCategory: 'Category',
  localOffers: [],
  selectedOffer: null,
  searchValue: '',
  searchLocation: {
    addressWithoutZIP: '',
    position: {
      latitude: null,
      longitude: null,
    },
    address: {},
  },
  results: [],
  offerLocation: {},
  paramsByLocation: {
    limit: 20,
    skip: 0,
  },
  paramsBySearch: {
    limit: 20,
    skip: 0,
  },
};

export default createReducer(initialState, {
  [Types.SET_CATEGORY]: (state, { payload }) => ({
    ...state,
    selectedCategory: payload.value,
  }),
  [Types.GET_CATEGORIES_SUCCESS]: (state, { payload }) => ({
    ...state,
    categories: [
      'All',
      ...payload.categories,
    ],
  }),
  [Types.SEARCH_BY_USER_LOCATION_SUCCESS]: (state, { payload }) => {
    let { limit, skip } = state.paramsByLocation;
    skip = payload.localOffers.length < limit ? 0 : skip + limit;

    return {
      ...state,
      localOffers: [...state.localOffers, ...payload.localOffers],
      paramsByLocation: {
        ...state.paramsByLocation,
        skip,
      },
    };
  },
  [Types.GET_OFFER_SUCCESS]: (state, { payload }) => ({
    ...state,
    selectedOffer: payload.offer,
  }),
  [Types.ON_CHANGE_SEARCH]: (state, { payload }) => ({
    ...state,
    searchValue: payload.text,
  }),
  [Types.SET_SEARCH_LOCATION_SUCCESS]: (state, { payload }) => ({
    ...state,
    searchLocation: {
      addressWithoutZIP: payload.locationData.addressWithoutZIP,
      ...payload.locationData.location,
    },
  }),
  [Types.EDIT_SEARCH_ADDRESS]: (state, { payload }) => ({
    ...state,
    searchLocation: {
      ...state.searchLocation,
      addressWithoutZIP: payload.text,
    },
  }),
  [Types.ERASE_SEARCH_LOCATION]: (state, { payload }) => ({
    ...state,
    searchLocation: initialState.searchLocation,
  }),
  [Types.GET_OFFERS_SUCCESS]: (state, { payload }) => {
    let { limit, skip } = state.paramsBySearch;
    console.log('paramsBySearch', state.paramsBySearch);
    skip = payload.results.length < limit ? 0 : skip + limit;

    return {
      ...state,
      results: [...state.results, ...payload.results],
      paramsBySearch: {
        ...state.paramsBySearch,
        skip,
      },
    };
  },
  [Types.SET_CHOSEN_OFFER_LOCATION]: (state, { payload }) => ({
    ...state,
    offerLocation: payload.location,
  }),
  [Types.REFRESH_BY_LOCATION]: state => ({
    ...state,
    localOffers: initialState.localOffers,
    paramsByLocation: initialState.paramsByLocation,
  }),
  [Types.RESET_SEARCH_RESULTS]: state => ({
    ...state,
    results: initialState.results,
    paramsBySearch: initialState.paramsBySearch,
  }),
});
