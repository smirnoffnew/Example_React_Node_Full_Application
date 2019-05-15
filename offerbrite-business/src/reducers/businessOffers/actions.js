import Types from './types';
import {
  getOffers as apiGetOffers,
  getPastOffers as apiGetPastOffers,
  deleteOffer as apiDeleteOffer,
} from '@/services/api';
import store from '@/store';
import { actions as requestActions } from '@/reducers/request';

export const getOffers = () => (dispatch, getState) => {
  const ownerId = getState().session.user.id;
  const { limit, skip } = getState().businessOffers.queryParams;
  dispatch({ type: Types.GET_OFFERS_START });
  dispatch(requestActions.start());

  apiGetOffers(ownerId, limit, skip)
    .then(response => {
      console.log('response', response);
      dispatch({
        type: Types.GET_OFFERS_SUCCESS,
        payload: {
          liveOffers: response.data.docs,
        },
      });
      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch(requestActions.fail(error));
      dispatch({ type: Types.GET_OFFERS_FAIL });
    });
};

export const getPastOffers = () => dispatch => {
  const ownerId = store.getState().session.user.id;
  dispatch({ type: Types.GET_PAST_OFFERS_START });
  dispatch(requestActions.start());

  apiGetPastOffers(ownerId)
    .then(response => {
      dispatch(requestActions.success());
      dispatch({
        type: Types.GET_PAST_OFFERS_SUCCESS,
        payload: {
          pastOffers: response.data.docs,
        },
      });
    })
    .catch(error => {
      dispatch(requestActions.fail(error));
      dispatch({ type: Types.GET_PAST_OFFERS_FAIL });
    });
};

export const deleteOffer = offerId => dispatch => {
  dispatch({ type: Types.DELETE_OFFER_START });
  dispatch(requestActions.start());

  apiDeleteOffer(offerId)
    .then(response => {
      dispatch({ type: Types.DELETE_OFFER_SUCCESS, payload: { offer: response.data } });
      dispatch(getOffers());
    })
    .catch(error => {
      dispatch({ type: Types.DELETE_OFFER_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const onRefresh = () => ({
  type: Types.ON_REFRESH,
});
