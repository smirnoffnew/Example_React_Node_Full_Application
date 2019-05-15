import { GoogleAnalyticsTracker, GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';
import { GOOGLE_ANALYTICS_TRACKER_ID } from 'react-native-dotenv';
import SessionActionTypes from '@/reducers/session/types';
import RequestActionTypes from '@/reducers/request/types';
import OfferActionTypes from '@/reducers/offer/types';
import BusinessOffersActionTypes from '@/reducers/businessOffers/types';
import EditProfileActionTypes from '@/reducers/editProfile/types';

GoogleAnalyticsSettings.setDispatchInterval(30);
const tracker = new GoogleAnalyticsTracker(GOOGLE_ANALYTICS_TRACKER_ID);

const analyze = (store, action, handlers) => {
  if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
    return handlers[action.type](store, action);
  }
};

const analytics = store => next => action => {
  analyze(store, action, {
    [SessionActionTypes.GET_USER_SUCCESS]: () => startApp(action),
    [SessionActionTypes.SIGN_IN_SUCCESS]: () => startApp(action),
    [SessionActionTypes.SIGN_UP_SUCCESS]: () => startApp(action),

    [EditProfileActionTypes.DELETE_USER_SUCCESS]: () => deleteAccount(action),

    [OfferActionTypes.POST_OFFER_SUCCESS]: () => trackOfferCreate(action, store),
    [OfferActionTypes.UPDATE_OFFER_SUCCESS]: () => trackOfferUpdate(action, store),

    [BusinessOffersActionTypes.DELETE_OFFER_SUCCESS]: () => trackOfferDelete(action, store),

    [RequestActionTypes.REQUEST_FAIL]: () => trackError(action),
  });

  next(action);
};

const GA_PRODUCT_ACTIONS = {
  DETAIL: 1,
  CLICK: 2,
  ADD: 3,
  REMOVE: 4,
};

export function GA_trackScreen(screenTitle) {
  tracker.trackScreenView(screenTitle);
}

function startApp(action) {
  const user = action.payload.user;
  tracker.setUser(user.id);
  tracker.trackEvent('App starts', 'Bootstrap');
}

function deleteAccount(action) {
  const { userId } = action.payload;
  tracker.trackEvent('Edit profile', 'Delete account', { label: userId });
}

function trackOfferCreate(action, store) {
  const offerPayload = formatOfferPayload(action, store);

  tracker.trackEvent(
    'Offer management',
    'Create',
    { label: offerPayload.title },
    {
      products: [offerPayload],
      productAction: { action: GA_PRODUCT_ACTIONS.ADD },
    },
  );
}

function trackOfferDelete(action, store) {
  const offerPayload = formatOfferPayload(action, store);

  tracker.trackEvent(
    'Offer management',
    'Delete',
    { label: offerPayload.title },
    {
      products: [offerPayload],
      productAction: { action: GA_PRODUCT_ACTIONS.REMOVE },
    },
  );
}

function trackOfferUpdate(action, store) {
  const offerPayload = formatOfferPayload(action, store);

  tracker.trackEvent(
    'Offer management',
    'Update',
    { label: offerPayload.title },
    {
      products: [offerPayload],
      productAction: { action: GA_PRODUCT_ACTIONS.REMOVE },
    },
  );
}

function trackError(action) {
  tracker.trackEvent('HTTP request fails', 'Error', {
    label: JSON.stringify(action.payload.error)
  });
}

function formatOfferPayload(action, store) {
  const { offer } = action.payload;
  const business = store.getState().business.businessItem;

  return {
    id: offer.id,
    name: offer.title,
    category: offer.category,
    brand: business.brandName,
  };
}

export default analytics;
