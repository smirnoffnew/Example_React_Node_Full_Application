import types from './types';

const initialState = {
  reportsList: [],
  params: {
    limit: 100,
    skip: 0,
  },
  filteredData: null,
  selectedReason: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_REPORTS_SUCCESS:
      return { ...state, reportsList: action.payload.reportsList };

    case types.ON_FILTER_BY_REASON:
      const { reason, filteredData } = action.payload;
      return {
        ...state,
        selectedReason: reason,
        filteredData,
      };

    case types.ON_FILTER_BY_SEARCH:
      return {
        ...state,
        filteredData: action.payload.filteredData,
      };

    case types.TURN_OFF_REPORTS_FILTER:
      return {
        ...state,
        filteredData: null,
        selectedReason: '',
      };

    default:
      return state;
  }
};
