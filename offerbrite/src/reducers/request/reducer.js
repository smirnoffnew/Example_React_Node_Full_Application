import createReducer from '@/services/helpers/createReducer';
import Types from './types';

const initialState = {
  notification: null,
  loading: false,
};

export default createReducer(initialState, {
  [Types.REQUEST_START]: (state, { payload }) => ({ ...state, notification: null, loading: true }),
  [Types.REQUEST_SUCCESS]: (state, { payload }) => ({ ...state, loading: false }),
  [Types.REQUEST_FAIL]: (state, { payload }) => ({ ...state, notification: payload.error, loading: false }),
  [Types.RESET_NOTIFICATION]: (state, { payload }) => ({ ...initialState }),
});
