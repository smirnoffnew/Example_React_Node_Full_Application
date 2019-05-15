import { API_URL } from '@/services/config';
import { API_VERSION } from 'react-native-dotenv';
const API_PATH = `${API_URL}/api/${API_VERSION}`;

export default {

  USERS_SIGNUP: `${API_PATH}/users`,
  USERS_SIGNIN: `${API_PATH}/auth/login`,

  GET_USER: `${API_PATH}/auth/login`,

  UPDATE_USER: userId => `${API_PATH}/users/${userId}`,
  UPDATE_USER_EMAIL: userId => `${API_PATH}/users/${userId}/email`,
  UPDATE_PASSWORD: userId => `${API_PATH}/users/${userId}/password`,
  UPDATE_NOTIFICATIONS_STATUS: userId => `${API_PATH}/users/${userId}/notifications`,

  SAVE_USER_COUNTRY: userId => `${API_PATH}/users/country/${userId}`,
  SAVE_USER_CATEGORY: userId => `${API_PATH}/users/categories/${userId}`,

  DELETE_USER: userId => `${API_PATH}/users/${userId}`,

  CHECK_REFRESH: `${API_PATH}/auth/check-refresh`,
  CHECK_ACCESS: `${API_PATH}/auth/check-access`,
  GET_ACCESS_TOKEN: `${API_PATH}/auth/token`,

  RESET_PASSWORD: `${API_PATH}/auth/reset-password`,

  GET_CATEGORIES: `${API_PATH}/categories?skip=0&limit=20&all=true`,

  GET_OFFERS_BY_LOCATION: (encodedLocation, limit, skip) => `${API_PATH}/offers?limit=${limit}&skip=${skip}&populate[]=business&status=active&loc_address=${encodedLocation}`,
  GET_OFFER_BY_ID: offerId => `${API_PATH}/offers/${offerId}?populate[]=owner&populate[]=business`,
  GET_BUSINESS_BY_ID: businessId => `${API_PATH}/businesses/${businessId}`,
  GET_OFFERS: (query, limit, skip) => `${API_PATH}/offers?limit=${limit}&skip=${skip}&populate[]=business&status=active&${query}`,

  GET_FAVORITE_OFFERS: (userId, limit = 50) => `${API_PATH}/users/${userId}/favourite-offers?limit=${limit}&populate[]=business`,
  POST_FAVORITE_OFFER: (userId, offerId) => `${API_PATH}/users/${userId}/favourite-offers/${offerId}`,
  DELETE_FAVORITE_OFFER: (userId, offerId) => `${API_PATH}/users/${userId}/favourite-offers/${offerId}`,

  POST_REPORT: `${API_PATH}/reports`,

  STATISTICS_ADD_VIEW: offerId => `${API_PATH}/offers/addView/${offerId}`,
  STATISTICS_ADD_FAVORITE: offerId => `${API_PATH}/offers/addFavorite/${offerId}`,
  STATISTICS_ADD_SHARE: offerId => `${API_PATH}/offers/addShared/${offerId}`,

  PUT_DEVICE_TOKEN: userId => `${API_PATH}/users/tokenAndSystem/${userId}`,
};
