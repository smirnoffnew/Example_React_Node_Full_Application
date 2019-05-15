import types from './types';

import {
  getUsers as apiGetUsers,
  deleteUser as apiDeleteUser,
  updateUser as apiUpdateUser,
} from 'services/api';

import { actions as requestActions } from 'reducers/request';

export const getUsers = () => async (dispatch, getState) => {
  const { limit, skip } = getState().reports.params;
  dispatch(requestActions.start());
  dispatch({ type: types.GET_USERS_START });

  try {
    const response = await apiGetUsers();
    console.log(response);
    dispatch(requestActions.success());
    dispatch({ type: types.GET_USERS_SUCCESS, payload: { usersList: response.data.data } });
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.GET_USERS_FAIL });
  }
};

export const deleteUser = userId => async dispatch => {
  dispatch(requestActions.start());
  dispatch({ type: types.DELETE_USER_START });

  try {
    const response = await apiDeleteUser(userId);
    console.log(response);
    if (response.data.status === 'OK') {
      dispatch(getUsers());
    }
    dispatch(requestActions.success());
    dispatch({ type: types.DELETE_USER_SUCCESS });
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.DELETE_USER_FAIL });
  }
};

export const setUserToUpdate = user => ({
  type: types.SET_USER_TO_UPDATE,
  payload: { user },
});

export const onChangeUserFormField = (e, fieldSelector) => ({
  type: types.ON_CHANGE_USER_FORM_FIELD,
  payload: { text: e.target.value, fieldSelector },
});

export const updateUser = () => async (dispatch, getState) => {
  const { id, email, username, isNotificationsEnabled, role } = getState().users.userToUpdate;
  dispatch(requestActions.start());
  dispatch({ type: types.UPDATE_USER_START });

  try {
    const response = await apiUpdateUser(id, {
      email,
      username,
      isNotificationsEnabled,
      role
    });
    console.log(response);
    if (response.data.status === 'OK') {
      dispatch(getUsers());
    }
    dispatch(requestActions.success());
    dispatch({ type: types.UPDATE_USER_SUCCESS });
  } catch (error) {
    dispatch(requestActions.fail(error));
    dispatch({ type: types.UPDATE_USER_FAIL });
  }
};

export const filterUsersByCategory = category => (dispatch, getState) => {
  const { usersList } = getState().users;
  
  const filteredData = usersList.filter(user => user.categories === category.toLowerCase());
  dispatch({
    type: types.FILTER_USERS_BY_CATEGORY,
    payload: { category, filteredData },
  });
};

export const filterUsersByCountry = country => (dispatch, getState) => {
  const { usersList } = getState().users;

  const filteredData = usersList.filter(user => user.country === country);
  dispatch({
    type: types.FILTER_USERS_BY_COUNTRY,
    payload: { country, filteredData },
  });
};

export const filterUsersBySearch = e => (dispatch, getState) => {
  const { usersList, selectedCategory, selectedCountry } = getState().users;

  const searchTarget = e.target.value.toLowerCase();
  const filteredData = usersList.filter(user => {
    const lowerName = user.username.toLowerCase();
    if (selectedCategory && selectedCountry) {
      return user.category === selectedCategory &&
        user.country === selectedCountry &&
        (lowerName.includes(searchTarget) ||
        user.email.includes(searchTarget));
    } else if (selectedCategory) {
      return user.category === selectedCategory &&
        (lowerName.includes(searchTarget) ||
        user.email.includes(searchTarget));
    } else if (selectedCountry) {
      return user.country === selectedCountry &&
        (lowerName.includes(searchTarget) ||
        user.email.includes(searchTarget));
    }
    return lowerName.includes(searchTarget) ||
      user.email.includes(searchTarget);
  });

  dispatch({
    type: types.FILTER_USERS_BY_SEARCH,
    payload: { filteredData }
  });
};

export const turnOffUsersFilter = () => ({
  type: types.TURN_OFF_USERS_FILTER,
});
