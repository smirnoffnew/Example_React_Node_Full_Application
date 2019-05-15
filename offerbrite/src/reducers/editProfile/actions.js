import Types from './types';
import {
  updateUser as apiUpdateUser,
  updateUserEmail as apiUpdateUserEmail,
  updatePassword as apiUpdatePassword,
  updateNotificationsStatus as apiUpdateNotificationsStatus,
  deleteUser as apiDeleteUser,
} from '@/services/api';
import { actions as requestActions } from '@/reducers/request';
import { actions as sessionActions } from '@/reducers/session';

import throwNotification from '@/services/helpers/notification';
import store from '@/store';

const updateUsername = (userId, newUsername) => dispatch => {
  dispatch({ type: Types.UPDATE_USER_START });
  dispatch(requestActions.start());

  const updatedUser = { username: newUsername };

  apiUpdateUser(userId, updatedUser)
    .then((response) => {
      dispatch({ type: Types.UPDATE_USER_SUCCESS });
      dispatch(sessionActions.getUser());
      throwNotification('Your name was successfully updated.', 'success');
    })
    .catch(error => {
      dispatch({ type: Types.UPDATE_USER_FAIL });
      dispatch(requestActions.fail(error));
    });
};

const updateUserEmail = (userId, data) => dispatch => {
  dispatch({ type: Types.UPDATE_EMAIL_START });
  dispatch(requestActions.start());

  data.newEmail = { email: data.newEmail };

  apiUpdateUserEmail(userId, data)
    .then(response => {
      dispatch({ type: Types.UPDATE_EMAIL_SUCCESS });
      dispatch(sessionActions.getUser());
      throwNotification('Your email address was successfully updated.', 'success');
    })
    .catch(error => {
      dispatch({ type: Types.UPDATE_EMAIL_FAIL });
      dispatch(requestActions.fail(error));
    });
};

const updateUserPassword = (userId, data) => dispatch => {
  dispatch({ type: Types.UPDATE_PASSWORD_START });
  dispatch(requestActions.start());

  data.newPassword = { password: data.newPassword };

  apiUpdatePassword(userId, data)
    .then(response => {
      dispatch({ type: Types.UPDATE_PASSWORD_SUCCESS });
      dispatch(requestActions.success());
      throwNotification('Your password was successfully updated.', 'success');
    })
    .catch(error => {
      dispatch({ type: Types.UPDATE_PASSWORD_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const setInitialUserForUpdate = () => {
  const actualUser = store.getState().session.user;

  return {
    type: Types.SET_INITIAL_USER_FOR_UPDATE,
    payload: {
      newUsername: actualUser.username,
      newEmail: actualUser.email,
    },
  };
};

export const updateUser = () => dispatch => {
  const actualUser = store.getState().session.user;
  const newUsername = store.getState().form.newUsername.values.newUsername;

  if (actualUser.username !== newUsername) {
    dispatch(updateUsername(actualUser.id, newUsername));
  } else {
    throwNotification('You have not changed your name');
  }
};

export const updateEmail = () => dispatch => {
  const actualUser = store.getState().session.user;
  const newEmailValues = store.getState().form.newEmail.values;

  if (actualUser.email !== newEmailValues.newEmail.toLowerCase()) {
    dispatch(updateUserEmail(actualUser.id, {
      email: actualUser.email,
      newEmail: newEmailValues.newEmail.toLowerCase(),
      password: newEmailValues.confirmationPassword,
    }));
  } else {
    throwNotification('You have not changed your email');
  }
};

export const updatePassword = () => dispatch => {
  const actualUser = store.getState().session.user;
  const newPasswordValues = store.getState().form.newPassword.values;

  const data = {
    email: actualUser.email,
    password: newPasswordValues.password,
    newPassword: newPasswordValues.newPassword,
  };

  dispatch(updateUserPassword(actualUser.id, data));
};

export const deleteUser = () => dispatch => {
  dispatch({ type: Types.DELETE_USER_START });
  dispatch(requestActions.start());

  const actualUser = store.getState().session.user;
  const password = store.getState().form.deleteUser.values.password;

  apiDeleteUser(actualUser.id, { email: actualUser.email, password })
    .then(response => {
      dispatch({ type: Types.DELETE_USER_SUCCESS, payload: { userId: actualUser.id } });
      dispatch(sessionActions.logout());
      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch({ type: Types.DELETE_USER_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const onToggleNotifications = () => dispatch => {
  dispatch({ type: Types.UPDATE_NOTIFICATIONS_STATUS_START });
  dispatch(requestActions.start());

  const user = store.getState().session.user;

  apiUpdateUser(user.id, { isNotificationsEnabled: !user.isNotificationsEnabled })
    .then(() => {
      dispatch({ type: Types.UPDATE_NOTIFICATIONS_STATUS_SUCCESS });
      dispatch(sessionActions.getUser());
    })
    .catch(error => {
      dispatch({ type: Types.UPDATE_NOTIFICATIONS_STATUS_FAIL });
      dispatch(requestActions.fail(error));
    });
};
