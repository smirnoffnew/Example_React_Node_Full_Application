import createReducer from '@/services/helpers/createReducer';
import Types from './types';

const initialState = {
  user: null,
  tokens: {
    access: null,
    refresh: null,
  },
};

export default createReducer(initialState, {
  [Types.SET_TOKENS]: (state, { payload }) => ({ ...state, tokens: payload.tokens }),

  [Types.SET_NEW_ACCESS_TOKEN]: (state, { payload }) => ({
    ...state, tokens: { ...state.tokens, access: payload.token },
  }),

  [Types.GET_USER_SUCCESS]: (state, { payload }) => ({ ...state, user: payload.user }),

  [Types.SIGN_IN_SUCCESS]: (state, { payload }) => ({
    ...state, user: payload.user, tokens: payload.tokens,
  }),

  [Types.SIGN_UP_SUCCESS]: (state, { payload }) => ({
    ...state, user: payload.user, tokens: payload.tokens,
  }),

  [Types.REMOVE_SESSION]: state => ({ ...initialState }),

  [Types.CHANGE_PASSWORD_SUCCESS]: (state, { payload }) => ({
    ...state,
    user: payload.user,
  }),
});
