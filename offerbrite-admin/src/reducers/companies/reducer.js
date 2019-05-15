import types from './types';

const initialState = {
  companiesList: [],
  params: {
    limit: 100,
    skip: 0,
  },
  filteredData: null,
  selectedCountry: '',
  companyToUpdate: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_COMPANIES_SUCCESS:
      return { ...state, companiesList: action.payload.companiesList };

    case types.FILTER_COMPANIES_BY_COUNTRY:
      const { country, filteredData } = action.payload;
      return {
        ...state,
        selectedCountry: country,
        filteredData,
      };

    case types.FILTER_COMPANIES_BY_SEARCH:
      return {
        ...state,
        filteredData: action.payload.filteredData,
      };

    case types.TURN_OFF_COMPANIES_FILTER:
      return {
        ...state,
        filteredData: null,
        selectedCountry: '',
      };

    case types.SET_COMPANY_TO_UPDATE:
      return {
        ...state,
        companyToUpdate: action.payload.company,
      };

    case types.ON_CHANGE_COMPANY_FORM_FIELD:
      return {
        ...state,
        companyToUpdate: {
          ...state.companyToUpdate,
          [action.payload.fieldTitle]: action.payload.text,
        },
      };

    case types.UPDATE_COMPANY_SUCCESS:
      return {
        ...state,
        companyToUpdate: initialState.companyToUpdate,
      };

    default:
      return state;
  }
};
