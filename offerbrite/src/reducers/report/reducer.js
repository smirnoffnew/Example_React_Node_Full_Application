import createReducer from '@/services/helpers/createReducer';
import Types from './types';

const initialState = {
  isReportSuccess: null,
  reportReasons: [
    'Inappropriate materials',
    'Spam or misrepresentation',
  ],
  selectedReason: 'Inappropriate materials',
};

export default createReducer(initialState, {
  [Types.ON_CHANGE_REASON]: (state, { payload }) => ({ ...state, selectedReason: payload.reason }),
  [Types.POST_REPORT_SUCCESS]: state => ({ ...state, isReportSuccess: true }),
  [Types.POST_REPORT_FAIL]: state => ({ ...state, isReportSuccess: false }),
  [Types.RESET_REPORT_STATUS]: () => ({ ...initialState }),
});
