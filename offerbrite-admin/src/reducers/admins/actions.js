import types from './types';
import {
  getAdmins as apiGetAdmins,
  createNewAdmin as apiCreateNewAdmin,
  deleteAdmin as apiDeleteAdmin,
  updateAdmin as apiUpdateAdmin,
} from 'services/api';

import { actions as requestActions } from 'reducers/request';

export const getAdmins = () => async dispatch => {
  dispatch(requestActions.start());
  dispatch({ type: types.GET_ADMINS_START });

  try {
    const response = await apiGetAdmins();
    console.log(response);
    dispatch(requestActions.success());
    dispatch({ type: types.GET_ADMINS_SUCCESS, payload: { admins: response.data.data } });
  } catch (error) {
    console.log(error);
    dispatch(requestActions.fail(error));
    dispatch({ type: types.GET_ADMINS_FAIL });
  }
};

export const createNewAdmin = () => async (dispatch, getState) => {
  const { email, name, password, selectedRole: role } = getState().admins.newAdmin;
  dispatch(requestActions.start());
  console.log({ email, name, password, role });
  try {
    const response = await apiCreateNewAdmin({ email, name, password, role });
    if (response.data) {
      await dispatch({ type: types.CREATE_NEW_ADMIN_SUCCESS });
      dispatch(requestActions.success());
      await dispatch(getAdmins());
    }
  } catch (error) {
    dispatch(requestActions.fail(error));
    console.log(error);
  }
};

export const onChangeNewAdminTextField = (event, inputName) => ({
  type: types.ON_CHANGE_NEW_ADMIN_TEXT_FIELD,
  payload: { text: event.target.value, inputName },
});

export const onChangeRole = role => ({
  type: types.ON_CHANGE_ROLE,
  payload: { role },
});

export const deleteAdmin = adminId => async dispatch => {
  dispatch(requestActions.start());
  dispatch({ type: types.DELETE_ADMIN_START });

  try {
    const response = await apiDeleteAdmin(adminId);
    if (response.data) {
      dispatch({ type: types.DELETE_ADMIN_SUCCESS });
      dispatch(getAdmins());
    }
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.DELETE_ADMIN_FAIL });
    console.log(error);
  }
}

export const setAdminToUpdate = admin => {
  const { username: name, email, role, id } = admin;
  return {
    type: types.SET_ADMIN_TO_UPDATE,
    payload: {
      name,
      email,
      role,
      id,
    },
  }
};

export const updateAdmin = () => async (dispatch, getState) => {
  const { email, name, role, password, id } = getState().admins.newAdmin;
  dispatch(requestActions.start());
  dispatch({ type: types.UPDATE_ADMIN_START });

  try {
    const response = await apiUpdateAdmin({ email, name, role, password, id });
    console.log(response);
    if (response.data) {
      dispatch({ type: types.UPDATE_ADMIN_SUCCESS });
      dispatch(getAdmins());
    }
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.UPDATE_ADMIN_FAIL });
    console.log(error);
  }
}