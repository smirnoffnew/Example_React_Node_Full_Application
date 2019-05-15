import Types from './types';
import {
  signup as apiSignup,
  signin as apiSignin,
  getUser as apiGetUser,
  resetPassword as apiResetPassword,
} from '@/services/api';
import { actions as requestActions } from '@/reducers/request';
import { actions as businessActions } from '@/reducers/business';
import * as storage from '@/services/helpers/dataStorage';
import { Platform, PermissionsAndroid } from 'react-native';
import throwNotification from '@/services/helpers/notification';
import store from '@/store';

export const logout = () => dispatch => {
  dispatch({ type: Types.REMOVE_SESSION });
  dispatch(businessActions.resetBusiness());
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
      console.log(error);
      dispatch({ type: Types.BOOTSTRAP_FAIL });
      dispatch(logout());
    });
};

export const getUser = () => dispatch => {
  dispatch({ type: Types.GET_USER_START });
  dispatch(requestActions.start());

  apiGetUser()
    .then(response => {
      if (response) {
        dispatch(businessActions.getBusinessByUserId(response.data.id));
        storage.saveUser(response.data);
        dispatch({ type: Types.GET_USER_SUCCESS, payload: { user: response.data } });
        dispatch(requestActions.success());
      }
    })
    .catch(error => {
      dispatch({ type: Types.GET_USER_FAIL });
      dispatch(requestActions.fail(error));
      dispatch(logout());
    });
};

export const signin = () => dispatch => {
  let { email, password } = store.getState().form.signin.values;
  email = email.toLowerCase().trim();
  dispatch({ type: Types.SIGN_IN_START });
  dispatch(requestActions.start());

  apiSignin({ email, password })
    .then(response => {
      storage.saveSession(response.data);
      dispatch({
        type: Types.SIGN_IN_SUCCESS,
        payload: {
          user: response.data.user,
          tokens: response.data.tokens,
        },
      });
      dispatch(businessActions.getBusinessByUserId(response.data.user.id));
    })
    .catch(error => {
      dispatch({ type: Types.SIGN_IN_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const signup = () => dispatch => {
  dispatch({ type: Types.SIGN_UP_START });
  dispatch(requestActions.start());

  let { email, password } = store.getState().form.signup.values;
  email = email.toLowerCase().trim();

  apiSignup({ email, password })
    .then(userResponse => {
      const accessToken = userResponse.data.tokens.access.token;
      console.log(userResponse);
      dispatch(businessActions.registerBusiness(accessToken));
      storage.saveSession(userResponse.data);
      dispatch({
        type: Types.SIGN_UP_SUCCESS,
        payload: {
          user: userResponse.data.user,
          tokens: userResponse.data.tokens,
        },
      });
      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch({ type: Types.SIGN_UP_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const resetPassword = () => dispatch => {
  let { email } = store.getState().form.forgotPassword.values;
  email = email.toLowerCase().trim();

  return apiResetPassword({ email });
};

export const requestCameraPermission = () => async dispatch => {
  if (Platform.OS === 'android' && Platform.Version >= 23) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA, {
          'title': 'Offerbrite Camera Permission',
          'message': 'Offerbrite needs access to your camera'
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        dispatch(requestExternalWritePermission());
      } else {
        throwNotification('Camera permission denied');
      }
    } catch (err) {
      dispatch({ type: Types.CAMERA_PERMISSIONS_FAIL });
      throwNotification(`Camera permission error, ${JSON.stringify(err)}`);
    }
  }
};

const requestExternalWritePermission = () => async dispatch => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
        'title': 'Offerbrite External Storage Write Permission',
        'message': 'Offerbrite needs access to Storage data in your SD Card'
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      dispatch(requestExternalReadPermission());
    } else {
      throwNotification('WRITE EXTERNAL STORAGE permission denied');
    }
  } catch (err) {
    throwNotification(`Write permission error, ${JSON.stringify(err)}`);
  }
};

const requestExternalReadPermission = () => async dispatch => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
        'title': 'Offerbrite Read Storage Permission',
        'message': 'Offerbrite needs access to your SD Card '
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      dispatch({ type: Types.CAMERA_PERMISSIONS_SUCCESS });
      return true;
    } else {
      throwNotification('READ_EXTERNAL_STORAGE permission denied');
      return false;
    }
  } catch (err) {
    throwNotification(`Read permission error, ${JSON.stringify(err)}`);
    return false;
  }
};

