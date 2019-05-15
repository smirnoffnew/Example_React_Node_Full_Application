import { createSelector } from 'reselect';

const report = state => state.report;

export const isReportSuccess = createSelector(
  report,
  reportState => reportState.isReportSuccess,
);

export const reportReasons = createSelector(
  report,
  reportState => reportState.reportReasons,
);

export const selectedReason = createSelector(
  report,
  reportState => reportState.selectedReason,
);
