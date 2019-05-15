import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';
import { reducer as sessionReducer } from './session';
import { reducer as requestReducer } from './request';
import { reducer as locationReducer } from './location';
import { reducer as editProfileReducer } from './editProfile';
import { reducer as searchReducer } from './search';
import { reducer as favoritesReducer } from './favorites';
import { reducer as reportReducer } from './report';
import { reducer as notificationsReducer } from './notifications';

export default combineReducers({
  form: formReducer,
  session: sessionReducer,
  request: requestReducer,
  location: locationReducer,
  editProfile: editProfileReducer,
  search: searchReducer,
  favorites: favoritesReducer,
  report: reportReducer,
  notifications: notificationsReducer,
});
