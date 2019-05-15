import createReducer from '@/services/helpers/createReducer';
import Types from './types';

const initialState = {
  favoriteOffers: [],
  willExpireSoon: [],
};

export default createReducer(initialState, {
  [Types.GET_FAVORITE_OFFERS_SUCCESS]: (state, { payload }) => ({
    ...state,
    favoriteOffers: payload.favoriteOffers,
  }),
  [Types.NOTIFY_ABOUT_EXPIRING_OFFER]: (state, { payload }) => ({
    ...state,
    willExpireSoon: [
      ...state.willExpireSoon,
      ...payload.offerIds,
    ],
  }),
});
