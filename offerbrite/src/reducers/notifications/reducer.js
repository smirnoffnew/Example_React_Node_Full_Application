import createReducer from '@/services/helpers/createReducer';
import Types from './types';

const initialState = {
  operationSystem: '',
  token: '',
  isTokenSetSuccessfully: false,
};

export default createReducer(initialState, {
  [Types.ON_GENEGATE_TOKEN]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [Types.SEND_DEVICE_TOKEN_SUCCESS]: state => ({
    ...state,
    isTokenSetSuccessfully: true,
  }),
  [Types.SEND_DEVICE_TOKEN_FAIL]: state => ({
    ...state,
    isTokenSetSuccessfully: false,
  }),
});
