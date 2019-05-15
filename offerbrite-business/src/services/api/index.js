import ApiAddresses from './apiAddresses';
import base64 from 'base-64';
import axios from 'axios';
import store from '@/store';

import { actions as sessionActions } from '@/reducers/session';
import { actions as requestActions } from '@/reducers/request';
import * as storage from '@/services/helpers/dataStorage';
import apiAddresses from './apiAddresses';

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

export const updateUser = (userId, data) => authRequest(
  ApiAddresses.UPDATE_USER(userId),
  {
    data,
    method: 'PUT',
  },
);

export const updateUserEmail = (userId, data) => axios({
  url: ApiAddresses.UPDATE_USER_EMAIL(userId),
  headers: { Authorization: `Basic ${base64.encode(`${data.email}:${data.password}`)}` },
  data: data.newEmail,
  method: 'PUT',
});

/**
 * Makes PUT request and updates user password
 * @param {string} userId - User identifier from `user` object from `session` reducer.
 * @param {object} data - All necessary data for email updating. Keys:
 * - email - Existing user email
 * - password {string} - Actual user password
 * - newPassword {FormData object} - New password string converted in form-data object { password: newpassword }
 * @returns {Promise}
 */
export const updatePassword = (userId, data) => axios({
  url: ApiAddresses.UPDATE_PASSWORD(userId),
  headers: { Authorization: `Basic ${base64.encode(`${data.email}:${data.password}`)}` },
  data: data.newPassword,
  method: 'PUT',
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

export const createBusiness = (body, accessToken) => axios({
  url: ApiAddresses.CREATE_BUSINESS,
  data: body,
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const getBusinessByUserId = userId => axios({
  url: ApiAddresses.GET_BUSINESS_BY_USER_ID(userId),
  method: 'GET',
});

export const uploadImage = (body, accessToken) => axios({
  url: ApiAddresses.UPLOAD_IMAGE,
  data: body,
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const updateBusiness = (businessId, body) => authRequest(
  ApiAddresses.UPDATE_BUSINESS(businessId),
  {
    data: body,
    method: 'PUT',
  },
);

export const getCategories = () => axios(ApiAddresses.GET_CATEGORIES);

export const createOffer = (businessId, body) => authRequest(
  ApiAddresses.CREATE_OFFER(businessId),
  {
    data: body,
    method: 'POST',
  }
);

export const deleteOffer = offerId => authRequest(
  ApiAddresses.DELETE_OFFER(offerId),
  {
    method: 'DELETE',
  }
);

export const getOffers = (ownerId, limit, skip) => axios(ApiAddresses.GET_OFFERS(ownerId, limit, skip));

export const getPastOffers = ownerId => axios(ApiAddresses.GET_PAST_OFFERS(ownerId));

export const updateOffer = (offerId, body) => authRequest(
  ApiAddresses.UPDATE_OFFER(offerId),
  {
    method: 'PUT',
    data: body,
  }
);
