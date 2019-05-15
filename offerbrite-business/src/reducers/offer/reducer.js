import createReducer from '@/services/helpers/createReducer';
import Types from './types';
import moment from 'moment';
import { DATE_FORMAT } from '@/services/helpers/formatDate';

const now = moment();
const tomorrow = moment(now).add(1, 'days');

const initialState = {
  image: {
    data: {
      uri: '',
      type: '',
      name: '',
    },
    imageUrl: '',
  },
  description: '',
  startDate: now.format(DATE_FORMAT),
  endDate: tomorrow.format(DATE_FORMAT),
  isDateHidden: false,
  places: [],
  categories: ['All'],
  selectedCategory: 'Category',
  newOffer: null,
  prevOffer: null,
};

export default createReducer(initialState, {
  [Types.ON_CHANGE_DESCRIPTION]: (state, { payload }) => ({
    ...state,
    description: payload.text,
  }),
  [Types.ON_DATE_CHANGE]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [Types.ON_TOGGLE_DATE_VISIBILITY]: (state, { payload }) => ({
    ...state,
    isDateHidden: !state.isDateHidden,
  }),
  [Types.SET_DEFAULT_PLACE]: (state, { payload }) => ({
    ...state,
    places: state.places.concat(payload.place),
  }),
  [Types.REMOVE_PLACE]: (state, { payload }) => ({
    ...state,
    places: state.places.filter((place, index) => index !== payload.index),
  }),
  [Types.ADD_PLACE]: (state, { payload }) => ({
    ...state,
    places: state.places.concat({ addressWithoutZIP: '', position: {}, address: {} }),
  }),
  [Types.EDIT_ADDRESS]: (state, { payload }) => ({
    ...state,
    places: state.places.map((place, index) => {
      if (index === payload.index) {
        return { ...place, addressWithoutZIP: payload.text };
      }
      return place;
    }),
  }),
  [Types.ERASE_ADDRESS]: (state, { payload }) => ({
    ...state,
    places: state.places.map((place, index) => {
      if (index === payload.index) {
        return { ...place, addressWithoutZIP: '' };
      }
      return place;
    }),
  }),
  [Types.SET_PLACE]: (state, { payload }) => ({
    ...state,
    places: state.places.map((place, index) => {
      if (index === payload.index) {
        return {
          addressWithoutZIP: payload.locationData.addressWithoutZIP,
          ...payload.locationData.location,
        };
      }
      return place;
    }),
  }),
  [Types.SET_CATEGORY]: (state, { payload }) => ({
    ...state,
    selectedCategory: payload.value,
  }),
  [Types.GET_CATEGORIES_SUCCESS]: (state, { payload }) => ({
    ...state,
    categories: [...payload.categories],
  }),
  [Types.SET_IMAGE]: (state, { payload }) => ({
    ...state,
    image: {
      data: {
        uri: payload.imageData.uri,
        type: payload.imageData.type,
        name: payload.imageData.fileName,
      },
      imageUrl: payload.imageData.uri,
    },
  }),
  [Types.REMOVE_OFFER_IMAGE]: (state, { payload }) => ({ ...state, image: initialState.image }),
  [Types.POST_OFFER_SUCCESS]: (state, { payload }) => ({ ...state, newOffer: payload.offer }),
  [Types.RESET_OFFER]: () => ({ ...initialState }),
  [Types.SET_OFFER_TO_EDIT]: (state, { payload }) => ({
    ...state,
    ...payload.initialData,
    selectedCategory: payload.initialData.category,
    isDateHidden: payload.initialData.isDateHidden,
    image: {
      ...state.image,
      ...payload.initialData.image,
    },
    startDate: moment(payload.initialData.startDate).format(DATE_FORMAT),
    endDate: moment(payload.initialData.endDate).format(DATE_FORMAT),
    prevOffer: {
      ...payload.prevOffer,
      startDate: moment(payload.prevOffer.startDate).format(DATE_FORMAT),
      endDate: moment(payload.prevOffer.endDate).format(DATE_FORMAT),
    },
  }),
  [Types.UPDATE_OFFER_SUCCESS]: (state, { payload }) => ({ ...state, newOffer: payload.offer }),
});
