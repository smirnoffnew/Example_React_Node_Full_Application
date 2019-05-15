import createReducer from '@/services/helpers/createReducer';
import Types from './types';

const initialState = {
  photos: [
    {
      imageUrl: '',
      imageBase64: '',
    },
  ],
  comment: '',
};

export default createReducer(initialState, {
  [Types.ON_CHANGE_COMMENT]: (state, { payload }) => ({ ...state, comment: payload.text }),
  [Types.ADD_NEW_IMAGE]: (state, { payload }) => ({
    ...state,
    photos: state.photos.concat({
      imageUrl: '',
      imageBase64: '',
    }),
  }),
  [Types.SAVE_IMAGE]: (state, { payload }) => ({
    ...state,
    photos: state.photos.map((photo, index) => {
      if (index === payload.imageId) {
        return {
          imageUrl: payload.imageUrl,
          imageBase64: payload.imageBase64,
        };
      }
      return photo;
    }),
  }),
  [Types.REMOVE_IMAGE]: (state, { payload }) => ({
    ...state,
    photos: state.photos
      .filter((photo, index, photos) => index !== payload.imageId),
  }),
});
