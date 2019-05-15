import types from './types';

export const start = () => ({
  type: types.REQUEST_START,
});

export const success = () => ({
  type: types.REQUEST_SUCCESS,
});

export const fail = error => ({
  type: types.REQUEST_FAIL,
  payload: { error },
});
