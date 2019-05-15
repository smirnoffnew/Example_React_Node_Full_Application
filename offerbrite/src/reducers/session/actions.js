import Types from './types';
import {
  signup as apiSignup,
  signin as apiSignin,
  getUser as apiGetUser,
  resetPassword as apiResetPassword,
} from '@/services/api';
import { actions as requestActions } from '@/reducers/request';
import { sendDeviceToken } from '@/reducers/notifications/actions';
import * as storage from '@/services/helpers/dataStorage';
import store from '@/store';

export const logout = () => dispatch => {
  dispatch({ type: Types.REMOVE_SESSION });
  storage.removeSession();
};

const setTokens = tokens => ({
  type: Types.SET_TOKENS,
  payload: { tokens },
});

export const setNewAccessToken = token => ({
  type: Types.SET_NEW_ACCESS_TOKEN,
  payload: { token }
});

export const bootstrap = () => dispatch => {
  dispatch({ type: Types.BOOTSTRAP_START });

  storage.getTokens()
    .then(data => {
      const tokens = storage.parseTokens(data);
      if (tokens !== null) {
        dispatch(setTokens(tokens));
        dispatch(getUser());
        dispatch({ type: Types.BOOTSTRAP_SUCCESS });
      } else {
        dispatch({ type: Types.BOOTSTRAP_REJECT });
        dispatch(logout());
      }
    })
    .catch((error) => {
      dispatch({ type: Types.BOOTSTRAP_FAIL });
      dispatch(logout());
    });
};

export const getUser = () => (dispatch, getState) => {
  dispatch({ type: Types.GET_USER_START });
  dispatch(requestActions.start());

  apiGetUser()
    .then(response => {
      if (response) {
        const user = response.data;
        const { isTokenSetSuccessfully, token, operationSystem } = getState().notifications;
        if (user.isNotificationsEnabled && !isTokenSetSuccessfully && token && operationSystem) {
          dispatch(sendDeviceToken(user.id, { token, operationSystem }));
        }
        storage.saveUser(response.data);
        dispatch({ type: Types.GET_USER_SUCCESS, payload: { user } });
        dispatch(requestActions.success());
      }
    })
    .catch(error => {
      dispatch({ type: Types.GET_USER_FAIL });
      dispatch(requestActions.fail(error));
      dispatch(logout());
    });
};

export const signin = () => (dispatch, getState) => {
  const { email, password } = getState().form.signin.values;
  const signInData = {
    email: email.trim().toLowerCase(),
    password: password.trim(),
  };

  dispatch({ type: Types.SIGN_IN_START });
  dispatch(requestActions.start());

  apiSignin(signInData)
    .then(response => {
      storage.saveSession(response.data);
      const { user, tokens } = response.data;
      dispatch({
        type: Types.SIGN_IN_SUCCESS,
        payload: { user, tokens },
      });
      const { isTokenSetSuccessfully, token, operationSystem } = getState().notifications;
      if (user.isNotificationsEnabled && !isTokenSetSuccessfully && token && operationSystem) {
        dispatch(sendDeviceToken(user.id, { token, operationSystem }));
      }
      storage.saveUser(response.data);
      dispatch(requestActions.success());

      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch({ type: Types.SIGN_IN_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const signup = () => (dispatch, getState) => {
  dispatch({ type: Types.SIGN_UP_START });
  dispatch(requestActions.start());

  const { email, username, password } = getState().form.signup.values;
  const signUpData = {
    email: email.trim().toLowerCase(),
    password: password.trim(),
    username: username.trim(),
  };

  apiSignup(signUpData)
    .then(response => {
      storage.saveSession(response.data);
      const { user, tokens } = response.data;
      dispatch({
        type: Types.SIGN_UP_SUCCESS,
        payload: { user, tokens },
      });

      const { isTokenSetSuccessfully, token, operationSystem } = getState().notifications;
      if (user.isNotificationsEnabled && !isTokenSetSuccessfully && token && operationSystem) {
        dispatch(sendDeviceToken(user.id, { token, operationSystem }));
      }

      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch({ type: Types.SIGN_UP_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const resetPassword = () => dispatch => {

  const email = store.getState().form.forgotPassword.values;

  return apiResetPassword(email);
};
