import types from './types';
import {
  checkHealth as apiCheckHealth,
  createNewAdmin as apiCreateNewAdmin,
  login as apiLogin,
} from 'services/api';

import { actions as requestActions } from 'reducers/request';

export const setToken = access => ({
  type: types.SET_TOKEN,
  payload: { access },
});

export const bootstrap = () => async dispatch => {
  try {
    const response = await apiCheckHealth();
    if (response) {
      const admin = JSON.parse(localStorage.getItem('admin'));
      await dispatch({ type: types.SET_ADMIN, payload: { admin } });
    } else {
      await dispatch(logout());
    }
  } catch (error) {
    await dispatch(logout());
  }
};

export const onChangeText = (e, inputName) => ({
  type: types.ON_CHANGE_LOGIN,
  payload: { text: e.target.value, inputName },
});

export const onToggleRememberSession = () => ({
  type: types.ON_TOGGLE_REMEMBER_SESSION,
});

export const login = () => async (dispatch, getState) => {
  const { email, password, rememberSession } = getState().session;
  dispatch(requestActions.start());

  try {
    const response = await apiLogin({ email, password });
    const { tokens, user: admin } = response.data;
    dispatch({
      type: types.LOGIN_SUCCESS,
      payload: {
        access: tokens.access,
        admin,
      },
    });

    if (rememberSession) {
      localStorage.setItem('access', JSON.stringify(tokens.access));
      localStorage.setItem('refresh', JSON.stringify(tokens.refresh));
      localStorage.setItem('admin', JSON.stringify(admin));
    }

    dispatch(requestActions.success());
    console.log(response);
  } catch (error) {
    dispatch(requestActions.fail(error));
    console.log(error.response);
    if (error.response && error.response.data.message === 'Unauthorized') {
      alert('Unauthorized');
    } else {
      alert('Something went wrong');
    }
  }
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('admin');
  localStorage.removeItem('refresh');

  return { type: types.LOGOUT };
};
