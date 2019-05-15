import Types from './types';
import store from '@/store';
import ImagePicker from 'react-native-image-picker';
import {
  getCategories as apiGetCategories,
  createOffer as apiCreateOffer,
  updateOffer as apiUpdateOffer,
  uploadImage as apiUploadImage,
  getBusinessByUserId as apiGetBusinessByUserId,
} from '@/services/api';
import { actions as requestActions } from '@/reducers/request';
import { actions as businessOffersActions } from '@/reducers/businessOffers';
import { convertAddressDataToString } from '@/services/helpers/geolocation';
import { prepareOfferData, setInitialOffer, compareOfferState } from '@/services/helpers/formatData';
import throwNotification from '@/services/helpers/notification';
import moment from 'moment';
import { DATE_FORMAT } from '@/services/helpers/formatDate';

export const onChangeDescription = text => ({
  type: Types.ON_CHANGE_DESCRIPTION,
  payload: { text },
});

export const onDateChange = (date, selector) => {
  let newStartDate, newEndDate;
  let oldStartDate = store.getState().offer.startDate;
  let oldEndDate = store.getState().offer.endDate;

  if (selector === 'startDate') {
    newStartDate = date;
    const newStartPlusHour = moment(newStartDate).add(1, 'hours');
    if (moment(oldEndDate).isBefore(newStartPlusHour)) {
      newEndDate = newStartPlusHour.format(DATE_FORMAT);
    } else {
      newEndDate = oldEndDate;
    }
  } else {
    newStartDate = oldStartDate;
    let nowPlusHour = moment().add(1, 'hours');
    if (moment(date).isBefore(nowPlusHour)) {
      newEndDate = nowPlusHour.format(DATE_FORMAT);
    } else {
      newEndDate = date;
    }
  }

  return {
    type: Types.ON_DATE_CHANGE,
    payload: { startDate: newStartDate, endDate: newEndDate },
  };
};

export const onToggleDateVisibility = () => ({
  type: Types.ON_TOGGLE_DATE_VISIBILITY,
});

export const setDefaultPlace = () => {
  const place = store.getState().business.businessItem.locations[0];
  const addressWithoutZIP = convertAddressDataToString(place.address);

  place.addressWithoutZIP = addressWithoutZIP;
  console.log(place);
  return {
    type: Types.SET_DEFAULT_PLACE,
    payload: { place },
  };
};

export const removePlace = index => ({
  type: Types.REMOVE_PLACE,
  payload: { index },
});

export const addPlace = () => ({
  type: Types.ADD_PLACE,
});

export const eraseAddress = index => ({
  type: Types.ERASE_ADDRESS,
  payload: { index },
});

export const editAddress = (text, index) => ({
  type: Types.EDIT_ADDRESS,
  payload: { text, index },
});

export const setPlace = (locationData, index) => {
console.log(locationData);
return ({
  type: Types.SET_PLACE,
  payload: { locationData, index },
});
};
export const getCategories = () => dispatch => {
  dispatch(requestActions.start());
  dispatch({ type: Types.GET_CATEGORIES_START });

  apiGetCategories()
    .then(response => {
      dispatch({
        type: Types.GET_CATEGORIES_SUCCESS,
        payload: { categories: response.data.docs },
      });
      dispatch(requestActions.success());
    })
    .catch(error => {
      dispatch({ type: Types.GET_CATEGORIES_FAIL });
      dispatch(requestActions.fail(error));
    });
};

export const setCategory = value => ({
  type: Types.SET_CATEGORY,
  payload: { value },
});

export const setOfferToEdit = offer => {
  const initialData = setInitialOffer(offer);

  console.log(initialData);
  return {
    type: Types.SET_OFFER_TO_EDIT,
    payload: { initialData, prevOffer: offer },
  };
};

const postOffer = (businessId, data) => (dispatch, getState) => {
  dispatch({ type: Types.POST_OFFER_START });
  dispatch(requestActions.start());

  apiCreateOffer(businessId, data)
    .then(response => {
      dispatch({
        type: Types.POST_OFFER_SUCCESS,
        payload: { offer: response.data },
      });
      dispatch(businessOffersActions.getOffers());
    })
    .catch(error => {
      dispatch({ type: Types.POST_OFFER_FAIL });
      dispatch(requestActions.fail(error));
    });
};

const putOffer = (offerId, updatedData) => dispatch => {
  dispatch({ type: Types.UPDATE_OFFER_START });
  dispatch(requestActions.start());

  apiUpdateOffer(offerId, updatedData)
    .then(response => {
      dispatch(businessOffersActions.getOffers());
      dispatch({
        type: Types.UPDATE_OFFER_SUCCESS, payload: { offer: response.data } });
    })
    .catch(error => {
      dispatch(requestActions(error));
      dispatch({ type: Types.UPDATE_OFFER_FAIL });
    });
};

export const updateOffer = () => (dispatch, getState) => {
  const offerId = getState().offer.prevOffer.id;
  const updatedData = compareOfferState();
  const imageData = getState().offer.image.data;
  const accessToken = getState().session.tokens.access.token;
  let formData;

  if (imageData.uri) {
    formData = new FormData();
    formData.append('image', imageData);

    dispatch({ type: Types.UPLOAD_OFFER_IMAGE_START });
    dispatch(requestActions.start());

    apiUploadImage(formData, accessToken)
      .then(response => {
        dispatch({ type: Types.UPLOAD_OFFER_IMAGE_SUCCESS });
        updatedData.imagesUrls = [response.data.url];
        dispatch(putOffer(offerId, updatedData));
      })
      .catch(error => {
        dispatch({ type: Types.UPLOAD_OFFER_IMAGE_FAIL });
        dispatch(requestActions.fail(error));
      });
  } else if (Object.keys(updatedData).length > 0) {
    dispatch(putOffer(offerId, updatedData));
  } else {
    throwNotification('You have not changed anything yet.');
  }
};

export const sendOffer = action => dispatch => {
  const businessId = store.getState().business.businessItem.id;
  const accessToken = store.getState().session.tokens.access.token;
  const image = store.getState().offer.image;

  const data = prepareOfferData();

  const formData = new FormData();
  formData.append('image', image.data);

  dispatch({ type: Types.UPLOAD_OFFER_IMAGE_START });
  dispatch(requestActions.start());

  apiUploadImage(formData, accessToken)
    .then(response => {
      console.log(response);
      dispatch({ type: Types.UPLOAD_OFFER_IMAGE_SUCCESS });
      data.imagesUrls = [response.data.url];

      if (action === 'create') {
        dispatch(postOffer(businessId, data));
      } else {
        //
      }
    })
    .catch(error => {
      dispatch({ type: Types.UPLOAD_OFFER_IMAGE_FAIL });
      dispatch(requestActions.fail(error));
    });
};

const setImageSuccess = imageData => ({
  type: Types.SET_IMAGE,
  payload: { imageData },
});

const removeOfferImage = () => ({ type: Types.REMOVE_OFFER_IMAGE });

export const setImage = () => dispatch => {
  ImagePicker.showImagePicker(
    {
      title: 'Add an image for your offer',
      customButtons: [
        { name: 'rm', title: 'Remove current image' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    }, response => {
      if (response.fileSize > 3145728) {
        throwNotification('Image size must be less than 3Mb');
        dispatch(removeOfferImage());
      } else if (response.didCancel) {
        return;
      } else if (response.customButton) {
        dispatch(removeOfferImage());
      } else {
        dispatch(setImageSuccess(response));
      }
    }
  );
};

export const resetOffer = () => ({
  type: Types.RESET_OFFER,
});
