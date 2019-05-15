import Types from './types';

export const start = () => ({
  type: Types.REQUEST_START,
});

export const success = () => ({
  type: Types.REQUEST_SUCCESS,
});

export const resetNotification = () => ({
  type: Types.RESET_NOTIFICATION,
});

const setError = message => ({
  type: Types.REQUEST_FAIL,
  payload: { error: message },
});

export const fail = error => dispatch => {
  if (error.response) {
    dispatch(setError(error.response.data));
  } else if (error.message) {
    dispatch(setError(error.message));
  } else {
    dispatch(setError('Sorry, something went wrong...'));
  }

  dispatch(resetNotification());
};
