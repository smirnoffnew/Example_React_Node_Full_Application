import Types from './types';
import ImagePicker from 'react-native-image-picker';
import throwNotification from '@/services/helpers/notification';
import store from '@/store';
import {
  createBusiness as apiCreateBusiness,
  uploadImage as apiUploadImage,
  getBusinessByUserId as apiGetBusinessByUserId,
} from '@/services/api';
import { actions as requestActions } from '@/reducers/request';

export const resetBusiness = () => ({
  type: Types.RESET_BUSINESS,
});

export const setAddress = locationData => ({
  type: Types.SET_ADDRESS,
  payload: { locationData },
});

export const editAddress = text => ({
  type: Types.EDIT_ADDRESS,
  payload: { text },
});

export const eraseAddress = () => ({
  type: Types.ERASE_ADDRESS,
});

export const changeCallingCode = values => ({
  type: Types.CHANGE_CALLING_CODE,
  payload: {
    ISOcode: values.cca2,
    callingCode: values.callingCode ? `+${values.callingCode}` : '',
  },
});

const setLogoSuccess = imageData => ({
  type: Types.SET_LOGO,
  payload: { imageData },
});

const removeLogo = () => ({ type: Types.REMOVE_LOGO });

export const setLogo = () => dispatch => {
  ImagePicker.showImagePicker(
    {
      title: 'Add Image',
      customButtons: [
        { name: 'rm', title: 'Remove Current Photo' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    }, response => {
      console.log(response);
      if (response.fileSize > 3145728) {
        throwNotification('Image size must be less than 3Mb');
        dispatch(removeLogo());
      } else if (response.didCancel) {
        return;
      } else if (response.customButton) {
        dispatch(removeLogo());
      } else {
        dispatch(setLogoSuccess(response));
      }
    }
  );
};

const createBusiness = (imageUrl, accessToken) => dispatch => {
  dispatch(requestActions.start());
  dispatch({ type: Types.CREATE_BUSINESS_START });

  const business = store.getState().form.business.values;
  const businessLocation = store.getState().business.location;
  const callingCode = store.getState().business.callingCode;
  const brandName = business.brandname.trim();

  const data = {
    brandName,
    locations: [businessLocation],
  };

  if (imageUrl) {
    data.logoUrl = imageUrl;
  }

  if (business.website) {
    let websiteUrl = business.website.toLowerCase().trim();
    websiteUrl = websiteUrl.startsWith('http://') || websiteUrl.startsWith('https://') ?
      websiteUrl :
      `http://${websiteUrl}`;

    data.websiteUrl = websiteUrl;
  }

  if (business.mobileNumber) {
    data.mobileNumbers = [`${callingCode}${business.mobileNumber}`];
  }
  console.log('CREATE_BUSINESS DATA', data);
  apiCreateBusiness(data, accessToken)
    .then(response => {
      dispatch({
        type: Types.CREATE_BUSINESS_SUCCESS,
        payload: { business: response.data },
      });
      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch(requestActions.fail(error));
      dispatch({ type: Types.CREATE_BUSINESS_FAIL });
    });
};

export const registerBusiness = accessToken => dispatch => {
  const logoData = store.getState().business.logo.data;

  if (logoData.uri) {
    dispatch({ type: Types.UPLOAD_IMAGE_START });

    const formData = new FormData();
    formData.append('image', logoData);

    apiUploadImage(formData, accessToken)
      .then(response => {
        dispatch(createBusiness(response.data.url, accessToken));
        dispatch({ type: Types.UPLOAD_IMAGE_SUCCESS });
      })
      .catch(error => {
        dispatch({ type: Types.UPLOAD_IMAGE_FAIL });
        dispatch(requestActions.fail(error));
      });
  } else {
    dispatch(createBusiness(null, accessToken));
  }
};

export const getBusinessByUserId = userId => dispatch => {
  apiGetBusinessByUserId(userId)
    .then(response => {
      console.log(response);
      dispatch({
        type: Types.GET_BUSINESS_SUCCESS,
        payload: { business: response.data.docs[0] },
      });
      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch(requestActions.fail(error));
      dispatch({ type: Types.GET_BUSINESS_FAIL });
    });
};
