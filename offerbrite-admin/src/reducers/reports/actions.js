import types from './types';

import {
  getReports as apiGetreports,
  deleteReport as apiDeleteReport,
} from 'services/api';

import { actions as requestActions } from 'reducers/request';

export const getReports = () => async (dispatch, getState) => {
  const { limit, skip } = getState().reports.params;
  dispatch(requestActions.start());
  dispatch({ type: types.GET_REPORTS_START });

  try {
    const response = await apiGetreports(limit, skip);
    console.log(response);
    dispatch(requestActions.success());
    dispatch({
      type: types.GET_REPORTS_SUCCESS,
      payload: {
        reportsList: response.data.data.filter(report => report.offer !== null && report.user !== null),
      }
    });
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.GET_REPORTS_FAIL });
  }
};

export const deleteReport = reportId => async dispatch => {
  dispatch(requestActions.start());
  dispatch({ type: types.DELETE_REPORT_START });
  console.log('reportId', reportId);
  try {
    const response = await apiDeleteReport(reportId);
    console.log('deleteReport', response);
    if (response.data.status === 'OK') {
      dispatch(getReports());
    }
    dispatch(requestActions.success());
    dispatch({ type: types.DELETE_REPORT_SUCCESS });
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.DELETE_REPORT_FAIL });
  }
};

export const onFilterByReason = reason => (dispatch, getState) => {
  const { reportsList } = getState().reports;

  const filteredData = reportsList.filter(item => item.reports.reason === reason);
  dispatch({
    type: types.ON_FILTER_BY_REASON,
    payload: { reason, filteredData },
  });
};

export const onFilterBySearch = e => (dispatch, getState) => {
  const { reportsList, selectedReason } = getState().reports;

  const searchTarget = e.target.value.toLowerCase();
  const filteredData = reportsList.filter(item => {
    const lowerTitle = item.offer.title.toLowerCase();
    if (selectedReason) {
      return lowerTitle.includes(searchTarget) && item.reports.reason === selectedReason;
    }
    return lowerTitle.includes(searchTarget);
  });

  dispatch({
    type: types.ON_FILTER_BY_SEARCH,
    payload: { filteredData }
  });
};

export const onFilterTurnOff = () => ({
  type: types.TURN_OFF_REPORTS_FILTER,
});
