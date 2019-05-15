import Types from './types';
import { postReport as apiPostReport } from '@/services/api';
import { actions as requestActions } from '@/reducers/request';

export const onChangeReason = reason => ({
  type: Types.ON_CHANGE_REASON,
  payload: { reason },
});

export const onReport = (offerId, reason) => dispatch => {
  dispatch(requestActions.start());
  dispatch({ type: Types.POST_REPORT_START });

  apiPostReport(offerId, reason)
    .then(() => {
      dispatch({ type: Types.POST_REPORT_SUCCESS });
      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch({ type: Types.POST_REPORT_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const resetReportStatus = () => ({
  type: Types.RESET_REPORT_STATUS,
});
