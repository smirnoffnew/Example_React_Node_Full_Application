import types from './types';

const initialState = {
  loading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_START:
      return { ...state, loading: true, error: null };
    case types.REQUEST_SUCCESS:
      return { ...state, loading: false, error: null };
    case types.REQUEST_FAIL:
      return { ...state, loading: false, error: action.payload.error };
    default:
      return state;
  }
};
