import createReducer from '@/services/helpers/createReducer';
import Types from './types';

const initialState = {
  newUsername: '',
  newEmail: '',
};

export default createReducer(initialState, {
  [Types.SET_INITIAL_USER_FOR_UPDATE]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
});
