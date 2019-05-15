import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';
import { reducer as sessionReducer } from './session';
import { reducer as businessReducer } from './business';
import { reducer as requestReducer } from './request';
import { reducer as verificationReducer } from './verification';
import { reducer as editProfileReducer } from './editProfile';
import { reducer as offerReducer } from './offer';
import { reducer as businessOffersReducer } from './businessOffers';

export default combineReducers({
  form: formReducer,
  session: sessionReducer,
  business: businessReducer,
  request: requestReducer,
  verification: verificationReducer,
  editProfile: editProfileReducer,
  offer: offerReducer,
  businessOffers: businessOffersReducer,
});
