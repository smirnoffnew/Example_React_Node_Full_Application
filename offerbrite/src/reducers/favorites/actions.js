import Types from './types';
import {
  getFavoriteOffers as apiGetFavoriteOffers,
  postFavoriteOffer as apiPostFavoriteOffer,
  deleteFavoriteOffer as apiDeleteFavoriteOffer,
  statisticsAddFavorite,
  saveUserCategory as apiSaveUserCategory,
} from '@/services/api';
import { actions as requestActions } from '@/reducers/request';
import store from '@/store';
import moment from 'moment';

import { detectAndNotifyAboutExpired } from '@/services/pushNotifications';

const notifyAboutExpiringOffer = offers => (dispatch, getState) => {
  setTimeout(() => {
    const { willExpireSoon } = getState().favorites;
    const { user } = getState().session;

    if (user.isNotificationsEnabled) {
      const expired = detectAndNotifyAboutExpired(offers, willExpireSoon);

      dispatch({
        type: Types.NOTIFY_ABOUT_EXPIRING_OFFER,
        payload: { offerIds: expired },
      });
    }
  }, 0);
};

const saveUserCategory = favoriteOffers => {
  if (favoriteOffers.length > 0) {
    const allCategories = {};
    favoriteOffers.forEach(offer => {
      if (offer.category in allCategories) {
        allCategories[offer.category] += 1;
      } else {
        allCategories[offer.category] = 1;
      }
    });
    let favoriteCategory = Object.keys(allCategories)[0];
    for (let [key, value] of Object.entries(allCategories)) {
      if (value > allCategories[favoriteCategory]) {
        favoriteCategory = key;
      }
    }
    const { user } = store.getState().session;
    apiSaveUserCategory(user.id, { categories: favoriteCategory });
  }
};

export const getFavoriteOffers = () => dispatch => {
  dispatch({ type: Types.GET_FAVORITE_OFFERS_START });
  dispatch(requestActions.start());

  const userId = store.getState().session.user.id;

  apiGetFavoriteOffers(userId)
    .then(response => {
      const offers = response.data.docs.map(offer => {
        if (moment().isBefore(moment(offer.endDate))) {
          return { ...offer, past: false };
        }
        return { ...offer, past: true };
      });

      const favoriteOffers = offers.filter(offer => !offer.past);

      dispatch(notifyAboutExpiringOffer(favoriteOffers));

      favoriteOffers.push(...offers.filter(offer => offer.past));

      saveUserCategory(favoriteOffers);

      dispatch({
        type: Types.GET_FAVORITE_OFFERS_SUCCESS,
        payload: { favoriteOffers },
      });
      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch({ type: Types.GET_FAVORITE_OFFERS_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const postFavoriteOffer = offer => (dispatch, getState) => {
  dispatch({ type: Types.POST_FAVORITE_OFFER_START });
  dispatch(requestActions.start());

  const userId = getState().session.user.id;

  apiPostFavoriteOffer(userId, offer.id)
    .then(() => {
      statisticsAddFavorite(offer.id);
      dispatch({
        type: Types.POST_FAVORITE_OFFER_SUCCESS,
        payload: { offer },
      });
      dispatch(getFavoriteOffers(userId));
    })
    .catch(error => {
      dispatch({ type: Types.POST_FAVORITE_OFFER_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const deleteFavoriteOffer = offer => (dispatch, getState) => {
  dispatch({ type: Types.DELETE_FAVORITE_OFFER_START });
  dispatch(requestActions.start());

  const userId = getState().session.user.id;

  apiDeleteFavoriteOffer(userId, offer.id)
    .then(() => {
      dispatch({ type: Types.DELETE_FAVORITE_OFFER_SUCCESS, payload: { offer } });
      dispatch(getFavoriteOffers(userId));
    })
    .catch(error => {
      dispatch({ type: Types.DELETE_FAVORITE_OFFER_FAIL });
      dispatch(requestActions.fail(error));
    });
};
