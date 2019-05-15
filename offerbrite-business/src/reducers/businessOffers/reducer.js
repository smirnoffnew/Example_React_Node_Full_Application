import createReducer from '@/services/helpers/createReducer';
import Types from './types';

const initialState = {
  liveOffers: [],
  pastOffers: [],
  queryParams: {
    limit: 20,
    skip: 0,
  },
};

export default createReducer(initialState, {
  [Types.GET_OFFERS_SUCCESS]: (state, { payload }) => ({
    ...state,
    liveOffers: [...state.liveOffers, ...payload.liveOffers].filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
    }),
    queryParams: {
      ...state.queryParams,
      skip: payload.liveOffers.length === 20
        ? state.queryParams.skip + state.queryParams.limit
        : state.queryParams.skip,
    },
  }),
  [Types.GET_PAST_OFFERS_SUCCESS]: (state, { payload }) => ({
    ...state,
    pastOffers: payload.pastOffers,
  }),
  [Types.ON_REFRESH]: () => ({
    ...initialState,
  }),
});
