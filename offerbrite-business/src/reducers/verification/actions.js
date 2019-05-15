import Types from './types';
import ImagePicker from 'react-native-image-picker';
import store from '@/store';
import throwNotification from '@/services/helpers/notification';

export const onChangeComment = text => ({
  type: Types.ON_CHANGE_COMMENT,
  payload: { text },
});

const saveImage = (imageId, imageUrl, imageBase64) => ({
  type: Types.SAVE_IMAGE,
  payload: {
    imageId,
    imageUrl,
    imageBase64,
  },
});

const removeImage = imageId => ({
  type: Types.REMOVE_IMAGE,
  payload: { imageId },
});

export const addNewImage = () => ({
  type: Types.ADD_NEW_IMAGE,
});

export const pickImage = imageId => dispatch => {
  ImagePicker.showImagePicker(
    {
      title: 'Add Image',
      customButtons: [
        { name: 'rm', title: 'Remove Photo' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    }, response => {
      if (response.fileSize > 3145728) {
        throwNotification('Image size must be less than 3Mb');
        dispatch(removeImage(imageId));
      } else if (response.didCancel) {
        return;
      } else if (response.customButton) {
        dispatch(removeImage(imageId));
      } else {
        dispatch(saveImage(imageId, response.uri, response.data));
      }
    }
  );
};
