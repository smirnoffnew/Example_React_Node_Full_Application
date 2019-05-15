import ApiAddresses from './apiAddresses';
import base64 from 'base-64';
import axios from 'axios';
import store from '@/store';

import { actions as sessionActions } from '@/reducers/session';
import { actions as requestActions } from '@/reducers/request';
import * as storage from '@/services/helpers/dataStorage';

const getTokens = () => store.getState().session.tokens;

const validateTokens = tokens => {
  if (tokens.access !== null && tokens.refresh !== null) {
    if (tokens.access.expiredIn > Date.now()) {
      return Promise.resolve(tokens.access.token);
    } else {
      if (tokens.refresh.expiredIn > Date.now()) {
        return getAccessToken(tokens.refresh.token)
          .then(response => {
            storage.saveAccessToken(response.data);
            store.dispatch(sessionActions.setNewAccessToken(response.data));
            return response.data.token;
          })
          .catch(error => {
            store.dispatch(requestActions.fail(error));
          });
      }

      return Promise.reject(new Error('Refresh token is not valid'));
    }
  }
};

const authRequest = (url, options = {}) => {
  const tokens = getTokens();
  return validateTokens(tokens)
    .then(accessToken => {
      return axios({
        ...options,
        url,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...options.headers,
        },
      });
    })
    .catch(error => {
      store.dispatch(requestActions.fail(error));
    });
};

// USERS
export const signup = body => axios({
  url: ApiAddresses.USERS_SIGNUP,
  method: 'POST',
  data: body,
});

export const signin = ({ email, password }) => axios({
  url: ApiAddresses.USERS_SIGNIN,
  headers: { Authorization: `Basic ${base64.encode(`${email}:${password}`)}` },
  method: 'POST',
});

export const getUser = () => authRequest(ApiAddresses.GET_USER, { method: 'GET' });

export const updateUser = (userId, data) => authRequest(ApiAddresses.UPDATE_USER(userId), {
  data,
  method: 'PUT',
});

export const updateUserEmail = (userId, data) => axios({
  url: ApiAddresses.UPDATE_USER_EMAIL(userId),
  headers: { Authorization: `Basic ${base64.encode(`${data.email}:${data.password}`)}` },
  data: data.newEmail,
  method: 'PUT',
});

export const updatePassword = (userId, data) => axios({
  url: ApiAddresses.UPDATE_PASSWORD(userId),
  headers: { Authorization: `Basic ${base64.encode(`${data.email}:${data.password}`)}` },
  data: data.newPassword,
  method: 'PUT',
});

export const updateNotificationsStatus = (userId, data) => authRequest(
  ApiAddresses.UPDATE_NOTIFICATIONS_STATUS(userId),
  {
    data,
    method: 'PUT',
  },
);

export const saveUserCountry = (userId, data) => axios({
  url: ApiAddresses.SAVE_USER_COUNTRY(userId),
  method: 'PUT',
  data,
});

export const saveUserCategory = (userId, data) => axios({
  url: ApiAddresses.SAVE_USER_CATEGORY(userId),
  method: 'PUT',
  data,
});

export const deleteUser = (userId, data) => axios({
  url: ApiAddresses.DELETE_USER(userId),
  headers: { Authorization: `Basic ${base64.encode(`${data.email}:${data.password}`)}` },
  method: 'DELETE',
});

// TOKENS
export const checkRefreshToken = refreshToken => axios({
  url: ApiAddresses.CHECK_REFRESH,
  headers: { Authorization: `Bearer ${refreshToken}` },
  method: 'GET',
});

export const checkAccessToken = accessToken => axios({
  url: ApiAddresses.CHECK_ACCESS,
  headers: { Authorization: `Bearer ${accessToken}` },
  method: 'GET',
});

export const getAccessToken = refreshToken => axios({
  url: ApiAddresses.GET_ACCESS_TOKEN,
  headers: { Authorization: `Bearer ${refreshToken}` },
  method: 'GET',
});

export const resetPassword = body => axios({
  url: ApiAddresses.RESET_PASSWORD,
  method: 'POST',
  data: body,
});

export const getCategories = () => axios(ApiAddresses.GET_CATEGORIES);

export const getOffersByUserLocation = (encodedLocation, limit, skip) =>
  axios(ApiAddresses.GET_OFFERS_BY_LOCATION(encodedLocation, limit, skip));

export const getOfferById = offerId => authRequest(ApiAddresses.GET_OFFER_BY_ID(offerId));

export const getBusinessById = businessId => authRequest(ApiAddresses.GET_BUSINESS_BY_ID(businessId));

export const getOffers = (query, limit, skip) => axios(ApiAddresses.GET_OFFERS(query, limit, skip));

export const getFavoriteOffers = (userId, limit = 50) => authRequest(ApiAddresses.GET_FAVORITE_OFFERS(userId, limit));

export const postFavoriteOffer = (userId, offerId) => authRequest(
  ApiAddresses.POST_FAVORITE_OFFER(userId, offerId),
  { method: 'POST' },
);

export const deleteFavoriteOffer = (userId, offerId) => authRequest(
  ApiAddresses.DELETE_FAVORITE_OFFER(userId, offerId),
  { method: 'DELETE' },
);

export const postReport = (offerId, reason) => authRequest(
  ApiAddresses.POST_REPORT,
  {
    method: 'POST',
    data: { offerId, reason },
  },
);

export const statisticsAddView = offerId => axios({
  url: ApiAddresses.STATISTICS_ADD_VIEW(offerId),
  method: 'PUT',
}).then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
    console.log(error.response);
});

export const statisticsAddFavorite = offerId => axios({
  url: ApiAddresses.STATISTICS_ADD_FAVORITE(offerId),
  method: 'PUT',
}).then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
    console.log(error.response);
});

export const statisticsAddShare = offerId => axios({
  url: ApiAddresses.STATISTICS_ADD_SHARE(offerId),
  method: 'PUT',
}).then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
    console.log(error.response);
});

export const sendDeviceToken = (userId, data) => axios({
  url: ApiAddresses.PUT_DEVICE_TOKEN(userId),
  method: 'PUT',
  data,
});
