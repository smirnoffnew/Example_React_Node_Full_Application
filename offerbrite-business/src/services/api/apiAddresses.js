import { API_URL } from '@/services/config';
import { API_VERSION } from 'react-native-dotenv';
const API_PATH = `${API_URL}/api/${API_VERSION}`;

export default {
  USERS_SIGNUP: `${API_PATH}/business-users`,
  USERS_SIGNIN: `${API_PATH}/auth/business-users/login`,

  GET_USER: `${API_PATH}/auth/business-users/login`,

  UPDATE_USER: userId => `${API_PATH}/business-users/${userId}`,
  UPDATE_USER_EMAIL: userId => `${API_PATH}/business-users/${userId}/email`,
  UPDATE_PASSWORD: userId => `${API_PATH}/business-users/${userId}/password`,

  DELETE_USER: userId => `${API_PATH}/business-users/${userId}`,

  CHECK_REFRESH: `${API_PATH}/auth/business-users/check-refresh`,
  CHECK_ACCESS: `${API_PATH}/auth/business-users/check-access`,
  GET_ACCESS_TOKEN: `${API_PATH}/auth/business-users/token`,

  RESET_PASSWORD: `${API_PATH}/auth/business-users/reset-password`,

  CREATE_BUSINESS: `${API_PATH}/businesses`,
  GET_BUSINESS_BY_USER_ID: userId => `${API_PATH}/businesses?ownerId=${userId}`,
  UPDATE_BUSINESS: businessId => `${API_PATH}/businesses/${businessId}`,

  UPLOAD_IMAGE: `${API_PATH}/storage/image`,

  GET_CATEGORIES: `${API_PATH}/categories?&limit=10&all=true`,

  CREATE_OFFER: businessId => `${API_PATH}/businesses/${businessId}/offers`,
  GET_OFFER_BY_ID: offerId =>
    `${API_PATH}/offers/${offerId}?populate[]=owner&populate[]=business`,
  GET_OFFERS: (ownerId, limit, skip) =>
    `${API_PATH}/offers?limit=${limit}&skip=${skip}&status=active&populate[]=business&populate[]=owner&ownerId=${ownerId}`,
  GET_PAST_OFFERS: ownerId =>
    `${API_PATH}/offers?limit=10&status=past&populate[]=business&populate[]=owner&ownerId=${ownerId}`,
  UPDATE_OFFER: offerId => `${API_PATH}/offers/${offerId}`,
  DELETE_OFFER: offerId => `${API_PATH}/offers/${offerId}`,
};
