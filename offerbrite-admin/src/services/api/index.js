import axios from 'axios';
import queryString from 'query-string';

import endpoints from './endpoints';
import { store } from '../../index';
import { actions as sessionActions } from 'reducers/session';

export * from './analytics';

export const getAccessToken = refreshToken => axios({
  url: endpoints.GET_ACCESS_TOKEN,
  headers: { Authorization: `Bearer ${refreshToken}` },
  method: 'GET',
});

export const checkAccessToken = accessToken => axios({
  url: endpoints.CHECK_ACCESS,
  headers: { Authorization: `Bearer ${accessToken}` },
  method: 'GET',
});

export const checkRefreshToken = refreshToken => axios({
  url: endpoints.CHECK_REFRESH,
  headers: { Authorization: `Bearer ${refreshToken}` },
  method: 'GET',
});

const checkTokens = async access => {
  try {
    const response = await checkAccessToken(access.token);
    if (response.data.status === 'OK') {
      await store.dispatch(sessionActions.setToken(access));
      return access.token;
    }
  } catch {
    const { refresh } = JSON.parse(localStorage.getItem('refresh'));
    if (refresh && refresh.token) {
      try {
        const response = await checkRefreshToken(refresh.token);
        if (response.data.status === 'OK') {
          try {
            const updatedAccess = await getAccessToken(refresh.token);
            return updatedAccess.data.token;
          } catch {
            await store.dispatch(sessionActions.logout());
          }
        } else {
          await store.dispatch(sessionActions.logout());
        }
      } catch {
        await store.dispatch(sessionActions.logout());
      }
    } else {
      await store.dispatch(sessionActions.logout());
    }
  }
}

const validateTokens = async () => {
  let { access } = store.getState().session;
  if (access.token) {
    try {
      const accessToken = await checkTokens(access);
      return accessToken;
    } catch {
      return;
    }
  } else {
    access = JSON.parse(localStorage.getItem('access'));
    try {
      const accessToken = await checkTokens(access);
      return accessToken;
    } catch {
      return;
    }
  }
};

export const authRequest = async (url, options = {}) => {
  try {
    const accessToken = await validateTokens();
    if (accessToken) {
      return axios({
        ...options,
        url,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...options.headers,
        },
      });
    }
  } catch (error) {
    console.log('authRequest CATCH block', error);
  }
};

export const checkHealth = () => authRequest(endpoints.CHECK_HEALTH, { method: 'GET' });

export const getCategories = () => axios.get(endpoints.GET_CATEGORIES);

export const createNewAdmin = data => authRequest(endpoints.CREATE_NEW_ADMIN, {
  method: 'POST',
  data
});

export const login = ({ email, password }) => axios({
  method: 'POST',
  url: endpoints.LOGIN,
  auth: { username: email, password }
});

export const getUsers = () => authRequest(endpoints.GET_USERS, {
  method: 'GET',
});

export const deleteUser = userId => authRequest(endpoints.DELETE_USER(userId), {
  method: 'DELETE',
});

export const updateUser = (userId, data) => authRequest(endpoints.UPDATE_USER(userId), {
  method: 'PUT',
  data,
});

export const getCompanies = () => authRequest(endpoints.GET_COMPANIES, {
  method: 'GET',
});

export const getBusinessById = businessId => authRequest(endpoints.GET_BUSINESS_BY_ID(businessId), {
  method: 'GET',
});

export const deleteCompany = businessUserId => authRequest(endpoints.DELETE_COMPANY(businessUserId), {
  method: 'DELETE',
});

export const updateCompany = (businessUserId, data) => authRequest(endpoints.UPDATE_COMPANY(businessUserId), {
  method: 'PUT',
  data,
});

export const getOffers = () => authRequest(endpoints.GET_OFFERS, {
  method: 'GET',
});

export const getOfferById = offerId => authRequest(endpoints.GET_OFFER_BY_ID(offerId), {
  method: 'GET',
});

export const deleteOffer = offerId => authRequest(endpoints.DELETE_OFFER(offerId), {
  method: 'DELETE',
});

export const updateOffer = (offerId, data) => authRequest(endpoints.UPDATE_OFFER(offerId), {
  method: 'PUT',
  data,
});

export const getAdmins = () => authRequest(endpoints.GET_ADMINS, {
  method: 'GET',
});

export const deleteAdmin = adminId => authRequest(endpoints.DELETE_ADMIN, {
  method: 'DELETE',
  data: { id: adminId },
});

export const updateAdmin = data => authRequest(endpoints.UPDATE_ADMIN, {
  method: 'PUT',
  data,
});

export const getReports = (limit, skip) => authRequest(endpoints.GET_REPORTS(limit, skip), {
  method: 'GET',
});

export const deleteReport = reportId => authRequest(endpoints.DELETE_REPORT(reportId), {
  method: 'DELETE',
});

export const sendNotification = (query, data) => authRequest(endpoints.SEND_NOTIFICATION(query), {
  method: 'POST',
  data,
});

export const getNotifications = () => authRequest(endpoints.GET_NOTIFICATIONS, {
  method: 'GET',
});

export const getNotificationById = notificationId => authRequest(endpoints.GET_NOTIFICATION_BY_ID(notificationId), {
  method: 'GET',
});

export const deleteNotification = notificationId => authRequest(endpoints.DELETE_NOTIFICATION(notificationId), {
  method: 'DELETE',
});

export const updateNotification = (notificationId, data) => authRequest(endpoints.UPDATE_ADMIN(notificationId), {
  method: 'PUT',
  data,
});
