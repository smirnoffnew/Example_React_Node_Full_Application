import types from './types';

const initialState = {
  offersList: [],
  params: {
    limit: 100,
    skip: 0,
  },
  filteredData: null,
  selectedCategory: '',
  selectedCountry: '',
  categories: [],
  offerToUpdate: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_OFFERS_SUCCESS:
      return { ...state, offersList: action.payload.offersList };

    case types.GET_OFFER_BY_ID_SUCCESS:
      return {
        ...state,
        offerToUpdate: action.payload,
      };

    case types.RESET_OFFER_TO_UPDATE:
      return {
        ...state,
        offerToUpdate: {},
      };

    case types.ON_CHANGE_OFFER_FORM_FIELD:
      return {
        ...state,
        offerToUpdate: {
          ...state.offerToUpdate,
          [action.payload.fieldTitle]: action.payload.text,
        },
      };

    case types.ON_CHANGE_CATEGORY:
      return {
        ...state,
        offerToUpdate: {
          ...state.offerToUpdate,
          category: action.payload.category.toLowerCase(),
        },
      };

    case types.GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload.categories,
      };

    case types.FILTER_OFFERS_BY_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload.category,
        filteredData: action.payload.filteredData,
      };

    case types.FILTER_OFFERS_BY_COUNTRY:
      return {
        ...state,
        selectedCountry: action.payload.country,
        filteredData: action.payload.filteredData,
      };

    case types.FILTER_OFFERS_BY_SEARCH:
      return {
        ...state,
        filteredData: action.payload.filteredData,
      };

    case types.TURN_OFF_OFFERS_FILTER:
      return {
        ...state,
        filteredData: null,
        selectedCategory: '',
        selectedCountry: '',
      };

    default:
      return state;
  }
};
