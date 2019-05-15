import endpoints from './endpoints';
import { authRequest } from './index';

// USER ANALYTICS API

export const AU__GetSessions = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_USER_GET_SESSIONS_GRAPH(startDate, endDate), {
  method: 'GET',
});

export const AU__GetSessionsByDevice = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_USER_GET_SESSIONS_BY_DEVICE(startDate, endDate), {
  method: 'GET',
});

export const AU__GetSessionsByCountry = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_USER_GET_SESSIONS_BY_COUNTRY(startDate, endDate), {
  method: 'GET',
});

export const AU__GetUserStats = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_USER_GET_USER_STATS(startDate, endDate), {
  method: 'GET',
});

export const AU__GetUsersGraph = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_USER_GET_USERS_GRAPH(startDate, endDate), {
  method: 'GET',
});

export const AU__GetSessionDurationGraph = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_USER_GET_SESSION_DURATION_GRAPH(startDate, endDate), {
  method: 'GET',
});

export const AU__GetScreenSupport = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_USER_GET_SCREEN_SUPPORT(startDate, endDate), {
  method: 'GET',
});

// BUSINESS ANALYTICS API

export const AB__GetSessions = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_BUSINESS_GET_SESSIONS_GRAPH(startDate, endDate), {
  method: 'GET',
});

export const AB__GetSessionsByDevice = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_BUSINESS_GET_SESSIONS_BY_DEVICE(startDate, endDate), {
  method: 'GET',
});

export const AB__GetSessionsByCountry = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_BUSINESS_GET_SESSIONS_BY_COUNTRY(startDate, endDate), {
  method: 'GET',
});

export const AB__GetUserStats = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_BUSINESS_GET_USER_STATS(startDate, endDate), {
  method: 'GET',
});

export const AB__GetUsersGraph = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_BUSINESS_GET_USERS_GRAPH(startDate, endDate), {
  method: 'GET',
});

export const AB__GetSessionDurationGraph = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_BUSINESS_GET_SESSION_DURATION_GRAPH(startDate, endDate), {
  method: 'GET',
});

export const AB__GetScreenSupport = (startDate, endDate) => authRequest(
  endpoints.ANALYTICS_BUSINESS_GET_SCREEN_SUPPORT(startDate, endDate), {
  method: 'GET',
});
