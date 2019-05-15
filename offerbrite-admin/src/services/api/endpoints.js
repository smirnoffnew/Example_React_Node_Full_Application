import API_URL from 'services/config';

export default {
  CREATE_NEW_ADMIN: `${API_URL}/users/admin`,
  LOGIN: `${API_URL}/auth/login`,

  CHECK_REFRESH: `${API_URL}/auth/check-refresh`,
  CHECK_ACCESS: `${API_URL}/auth/check-access`,
  GET_ACCESS_TOKEN: `${API_URL}/auth/token`,

  GET_USERS: `${API_URL}/users/admin/allUsers`,
  DELETE_USER: userId => `${API_URL}/users/admin/users/${userId}`,
  UPDATE_USER: userId => `${API_URL}/users/admin/users/${userId}`,

  GET_COMPANIES: `${API_URL}/users/admin/allBusinessUsers`,
  GET_BUSINESS_BY_ID: businessId => `${API_URL}/users/admin/business/${businessId}`,
  DELETE_COMPANY: businessUserId => `${API_URL}/users/admin/businessUsers/${businessUserId}`,
  UPDATE_COMPANY: businessUserId => `${API_URL}/users/admin/businessUsers/${businessUserId}`,

  GET_ADMINS: `${API_URL}/users/admin/all`,
  DELETE_ADMIN: `${API_URL}/users/admin`,
  UPDATE_ADMIN: `${API_URL}/users/admin`,

  GET_OFFERS: `${API_URL}/users/admin/allOffers`,
  DELETE_OFFER: offerId => `${API_URL}/users/admin/offer/${offerId}`,
  GET_OFFER_BY_ID: offerId => `${API_URL}/users/admin/offer/${offerId}`,
  UPDATE_OFFER: offerId => `${API_URL}/users/admin/offer/${offerId}`,

  GET_REPORTS: (limit, skip) => `${API_URL}/reports?limit=${limit}&skip=${skip}`,
  DELETE_REPORT: reportId => `${API_URL}/users/admin/reports/${reportId}`,

  GET_CATEGORIES: `${API_URL}/categories?all=true`,

  CHECK_HEALTH: `${API_URL}/health-check`,

  SEND_NOTIFICATION: query => `${API_URL}/notification/send${query}`,
  GET_NOTIFICATIONS: `${API_URL}/notification/list`,
  GET_NOTIFICATION_BY_ID: notificationId => `${API_URL}/notification/${notificationId}`,
  UPDATE_NOTIFICATION: notificationId => `${API_URL}/notification/${notificationId}`,
  DELETE_NOTIFICATION: notificationId => `${API_URL}/notification/${notificationId}`,

  ANALYTICS_USER_GET_SESSIONS_GRAPH: (startDate, endDate) => `${API_URL}/ga-report/sessionsGraph/${startDate}/${endDate}`,
  ANALYTICS_USER_GET_USERS_GRAPH: (startDate, endDate) => `${API_URL}/ga-report/usersGraph/${startDate}/${endDate}`,
  ANALYTICS_USER_GET_SESSION_DURATION_GRAPH: (startDate, endDate) => `${API_URL}/ga-report/sessionDurationGraph/${startDate}/${endDate}`,
  
  ANALYTICS_USER_GET_USER_STATS: (startDate, endDate) => `${API_URL}/ga-report/userstata/${startDate}/${endDate}`,
  ANALYTICS_USER_GET_SESSIONS_BY_DEVICE: (startDate, endDate) => `${API_URL}/ga-report/sessiondevice/${startDate}/${endDate}`,
  ANALYTICS_USER_GET_SESSIONS_BY_COUNTRY: (startDate, endDate) => `${API_URL}/ga-report/country/${startDate}/${endDate}`,
  ANALYTICS_USER_GET_SCREEN_SUPPORT: (startDate, endDate) => `${API_URL}/ga-report/screensuport/${startDate}/${endDate}`,
  
  ANALYTICS_BUSINESS_GET_SESSIONS_GRAPH: (startDate, endDate) => `${API_URL}/ga-report/sessionsGraphBusiness/${startDate}/${endDate}`,
  ANALYTICS_BUSINESS_GET_USERS_GRAPH: (startDate, endDate) => `${API_URL}/ga-report/usersGraphBusiness/${startDate}/${endDate}`,
  ANALYTICS_BUSINESS_GET_SESSION_DURATION_GRAPH: (startDate, endDate) => `${API_URL}/ga-report/sessionDurationGraphBusiness/${startDate}/${endDate}`,
  
  ANALYTICS_BUSINESS_GET_USER_STATS: (startDate, endDate) => `${API_URL}/ga-report/userstataBusiness/${startDate}/${endDate}`,
  ANALYTICS_BUSINESS_GET_SESSIONS_BY_DEVICE: (startDate, endDate) => `${API_URL}/ga-report/sessiondeviceBusiness/${startDate}/${endDate}`,
  ANALYTICS_BUSINESS_GET_SESSIONS_BY_COUNTRY: (startDate, endDate) => `${API_URL}/ga-report/countryBusiness/${startDate}/${endDate}`,
  ANALYTICS_BUSINESS_GET_SCREEN_SUPPORT: (startDate, endDate) => `${API_URL}/ga-report/screensuportBusiness/${startDate}/${endDate}`,
};
