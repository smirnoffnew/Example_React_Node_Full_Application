import Types from './types';
import {
  updateUser as apiUpdateUser,
  updateBusiness as apiUpdateBusiness,
  updateUserEmail as apiUpdateUserEmail,
  updatePassword as apiUpdatePassword,
  deleteUser as apiDeleteUser,
  uploadImage as apiUploadImage,
} from '@/services/api';
import { actions as requestActions } from '@/reducers/request';
import { actions as sessionActions } from '@/reducers/session';
import ImagePicker from 'react-native-image-picker';

import throwNotification from '@/services/helpers/notification';
import store from '@/store';

export const updateUser = () => dispatch => {
  dispatch({ type: Types.UPDATE_USER_START });
  dispatch(requestActions.start());

  const user = store.getState().session.user;

  apiUpdateUser(user.id, { isNotificationsEnabled: !user.isNotificationsEnabled })
    .then(() => {
      dispatch(sessionActions.getUser());
      dispatch({ type: Types.UPDATE_USER_SUCCESS });
    })
    .catch(error => {
      dispatch(requestActions.fail(error));
      dispatch({ type: Types.UPDATE_USER_FAIL });
    });
};

const updateName = (businessId, newBrandName) => dispatch => {
  dispatch({ type: Types.UPDATE_NAME_START });
  dispatch(requestActions.start());

  apiUpdateBusiness(businessId, { brandName: newBrandName })
    .then(() => {
      dispatch({ type: Types.UPDATE_NAME_SUCCESS });
      dispatch(sessionActions.getUser());
      throwNotification('Your name was successfully updated.', 'success');
    })
    .catch(error => {
      dispatch({ type: Types.UPDATE_NAME_FAIL });
      dispatch(requestActions.fail(error));
    });
};

const updateUserEmail = (userId, data) => dispatch => {
  dispatch({ type: Types.UPDATE_EMAIL_START });
  dispatch(requestActions.start());

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

export const setInitialBusinessForUpdate = () => {
  const actualUser = store.getState().session.user;
  const actualBusiness = store.getState().business.businessItem;

  return {
    type: Types.SET_INITIAL_BUSINESS_FOR_UPDATE,
    payload: {
      newEmail: actualUser.email,
      newBusiness: actualBusiness,
    },
  };
};

export const updateBrandName = () => dispatch => {
  const actualBusiness = store.getState().business.businessItem;
  const newBrandName = store.getState().form.newBrandName.values.newBrandName.trim();

  if (actualBusiness.brandName !== newBrandName) {
    dispatch(updateName(actualBusiness.id, newBrandName));
  } else {
    throwNotification('You have not changed your name');
  }
};

export const updateEmail = () => dispatch => {
  const actualUser = store.getState().session.user;
  const newEmailValues = store.getState().form.newEmail.values;
  const newEmail = newEmailValues.newEmail.toLowerCase().trim();

  if (actualUser.email !== newEmail) {
    dispatch(updateUserEmail(actualUser.id, {
      email: actualUser.email,
      newEmail: { email: newEmail },
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
    newPassword: { password: newPasswordValues.newPassword },
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

export const changeMobileCode = (values, index) => ({
  type: Types.CHANGE_MOBILE_CODE,
  payload: {
    ISOcode: values.cca2,
    callingCode: values.callingCode ? `+${values.callingCode}` : '',
    index,
  },
});

export const removePhoneField = index => ({
  type: Types.REMOVE_PHONE_FIELD,
  payload: { index },
});

export const addPhoneField = () => ({
  type: Types.ADD_PHONE_FIELD,
});

/**
 * Synchronize mobile number values between `redux-form` forms and `mobileNumbers` items
 * @param {string} text - Text value from <Field /> component
 * @param {number} index - Identifier of target mobile number to change
 */
export const onChangeControl = (text, index) => ({
  type: Types.ON_CHANGE_PHONE_VALUE,
  payload: { text, index },
});

export const updateContacts = () => dispatch => {
  const actualBusiness = store.getState().business.businessItem;
  const data = compareContactsBeforeUpdate();

  if (Object.keys(data).length > 0) {
    dispatch({ type: Types.UPDATE_CONTACTS_START });
    dispatch(requestActions.start());

    apiUpdateBusiness(actualBusiness.id, data)
      .then(response => {
        if (response) {
          dispatch({ type: Types.UPDATE_CONTACTS_SUCCESS });
          dispatch(sessionActions.getUser());
          throwNotification('Your contacts were successfully updated.', 'success');
        }
      })
      .catch(error => {
        dispatch({ type: Types.UPDATE_CONTACTS_FAIL });
        dispatch(requestActions.fail(error));
      });
  } else {
    throwNotification('You have not changed your contacts');
  }
};

export const compareContactsBeforeUpdate = () => {
  const actualBusiness = store.getState().business.businessItem;
  const newWebsite = store.getState().form.newContacts.values.website.toLowerCase().trim();
  const newMobileNumbers = store.getState().editProfile.mobileNumbers;

  const data = {};

  if (actualBusiness.websiteUrl !== newWebsite) { // check if url is updated
    data.websiteUrl = newWebsite.startsWith('http://') || newWebsite.startsWith('https://') ?
      newWebsite :
      `http://${newWebsite}`;
  }

  const formattedCurrentNumbers = actualBusiness.mobileNumbers.map(mobileNumber => (
    `+${mobileNumber.cc}${mobileNumber.number}`
  ));
  const formattedNewNumbers = newMobileNumbers.map(mobileNumber => (
    `${mobileNumber.callingCode}${mobileNumber.number}`
  ));
  const filteredNumbers = formattedNewNumbers.filter(mobileNumber => ( // check if at least one number was updated
    !formattedCurrentNumbers.includes(mobileNumber)
  ));
  if (filteredNumbers.length > 0 || formattedNewNumbers.length !== formattedCurrentNumbers.length) {
    data.mobileNumbers = [...new Set(formattedNewNumbers)]; // save only unique values
  }

  return data;
};

export const setNewAddress = locationData => ({
  type: Types.SET_NEW_ADDRESS,
  payload: { locationData },
});

export const editNewAddress = text => ({
  type: Types.EDIT_NEW_ADDRESS,
  payload: { text },
});

export const eraseAddress = () => ({
  type: Types.ERASE_ADDRESS,
});

export const updateAddress = () => dispatch => {
  dispatch({ type: Types.UPDATE_ADDRESS_START });
  dispatch(requestActions.start());

  const actualBusiness = store.getState().business.businessItem;
  const newLocation = store.getState().editProfile.newLocation;

  apiUpdateBusiness(actualBusiness.id, { locations: [newLocation] })
    .then(response => {
      if (response) {
        dispatch({ type: Types.UPDATE_ADDRESS_SUCCESS });
        dispatch(sessionActions.getUser());
        throwNotification('Your address was successfully updated.', 'success');
      }
    })
    .catch(error => {
      dispatch({ type: Types.UPDATE_ADDRESS_FAIL });
      dispatch(requestActions.fail(error));
    });
};

const setLogoSuccess = imageData => dispatch => {
  dispatch({ type: Types.UPLOAD_NEW_LOGO_START });
  const actualBusiness = store.getState().business.businessItem;
  const accessToken = store.getState().session.tokens.access.token;

  const data = {
    uri: imageData.uri,
    type: imageData.type,
    name: imageData.fileName,
  };

  const formData = new FormData();
  formData.append('image', data);

  apiUploadImage(formData, accessToken)
    .then(response => {
      dispatch({ type: Types.UPLOAD_NEW_LOGO_SUCCESS });
      dispatch({ type: Types.UPDATE_LOGO_START });
      apiUpdateBusiness(actualBusiness.id, { logoUrl: response.data.url })
        .then(response => {
          dispatch(sessionActions.getUser());
          dispatch({ type: Types.UPDATE_LOGO_SUCCESS });
        })
        .catch(error => {
          dispatch({ type: Types.UPDATE_LOGO_FAIL });
          dispatch(requestActions.fail(error));
        });
    })
    .catch(error => {
      dispatch({ type: Types.UPLOAD_NEW_LOGO_FAIL });
      dispatch(requestActions.fail(error));
    });
};

const removeCurrentLogo = () => dispatch => {
  dispatch({ type: Types.REMOVE_CURRENT_LOGO_START });
  const actualBusiness = store.getState().business.businessItem;

  apiUpdateBusiness(actualBusiness.id, { logoUrl: '' })
    .then(response => {
      dispatch(sessionActions.getUser());
      dispatch({ type: Types.REMOVE_CURRENT_LOGO_SUCCESS });
    })
    .catch(error => {
      dispatch({ type: Types.REMOVE_CURRENT_LOGO_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const setNewLogo = () => dispatch => {
  ImagePicker.showImagePicker(
    {
      title: 'Change Logo',
      customButtons: [
        { name: 'rm', title: 'Remove Current Logo' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    }, response => {
      console.log(response);
      if (response.fileSize > 3145728) {
        throwNotification('Image size must be less than 3Mb');
        return;
      } else if (response.didCancel) {
        return;
      } else if (response.customButton) {
        dispatch(removeCurrentLogo());
      } else {
        dispatch(setLogoSuccess(response));
      }
    }
  );
};
