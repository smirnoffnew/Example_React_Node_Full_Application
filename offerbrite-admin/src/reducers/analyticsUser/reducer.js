import types from './types';
import { timeSelectors, TIME_PERIODS } from 'services/helpers';

const initialState = {
  graphModes: [
    'Sessions',
    'Users',
    'Session duration',
  ],
  selectedGraphMode: 'Sessions',
  sessions: {
    requestedTime: 'Last 7 days',
    times: TIME_PERIODS,
    startDate: timeSelectors.WEEK_AGO,
    endDate: timeSelectors.YESTERDAY,
    data: [],
  },
  sessionsByDevice: {
    requestedTime: 'Last 7 days',
    times: TIME_PERIODS,
    startDate: timeSelectors.WEEK_AGO,
    endDate: timeSelectors.YESTERDAY,
    data: [],
  },
  sessionsByCountry: {
    requestedTime: 'Last 7 days',
    times: TIME_PERIODS,
    startDate: timeSelectors.WEEK_AGO,
    endDate: timeSelectors.YESTERDAY,
    data: [],
  },
  userStats: {
    data: {},
    previousData: null,
  },
  usersGraph: {
    data: [],
  },
  sessionDurationGraph: {
    data: [],
  },
  screenSupport: {
    requestedTime: 'Last 7 days',
    times: TIME_PERIODS,
    startDate: timeSelectors.WEEK_AGO,
    endDate: timeSelectors.YESTERDAY,
    data: [],
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.USER_ON_CHANGE_GRAPH_MODE:
      return {
        ...state,
        selectedGraphMode: action.payload.mode,
      };

    case types.USER_GET_SESSIONS_SUCCESS:
      return {
        ...state,
        sessions: {
          ...state.sessions,
          data: action.payload.data,
        },
      };

    case types.USER_GET_SESSIONS_BY_DEVICE_SUCCESS:
      return {
        ...state,
        sessionsByDevice: {
          ...state.sessionsByDevice,
          data: action.payload.data,
        },
      };

    case types.USER_GET_SESSIONS_BY_COUNTRY_SUCCESS:
      return {
        ...state,
        sessionsByCountry: {
          ...state.sessionsByCountry,
          data: action.payload.data,
        },
      };

    case types.USER_GET_USER_STATS_SUCCESS:
      return {
        ...state,
        userStats: {
          ...state.userStats,
          data: action.payload.data,
        },
      };

    case types.USER_GET_USER_PREVIOUS_STATS_SUCCESS:
      return {
        ...state,
        userStats: {
          ...state.userStats,
          previousData: action.payload.previousData,
        },
      };

    case types.USER_GET_USER_PREVIOUS_STATS_FAIL:
      return {
        ...state,
        userStats: {
          ...state.userStats,
          previousData: null,
        },
      };

    case types.USER_GET_USERS_GRAPH_SUCCESS:
      return {
        ...state,
        usersGraph: {
          ...state.usersGraph,
          data: action.payload.data,
        },
      };

    case types.USER_GET_SESSION_DURATION_GRAPH_SUCCESS:
      return {
        ...state,
        sessionDurationGraph: {
          ...state.sessionDurationGraph,
          data: action.payload.data,
        },
      };

    case types.USER_GET_SCREEN_SUPPORT_SUCCESS:
      return {
        ...state,
        screenSupport: {
          ...state.screenSupport,
          data: action.payload.data,
        },
      };

    case types.USER_ON_CHANGE_REQUESTED_TIME:
      const dataSelector = Object.keys(action.payload)[0];
      return {
        ...state,
        [dataSelector]: {
          ...state[dataSelector],
          ...action.payload[dataSelector],
        },
      };
    default:
      return state;
  }
};
