import { GoogleAnalyticsTracker, GoogleAnalyticsSettings } from 'react-native-google-analytics-bridge';
import { GOOGLE_ANALYTICS_TRACKER_ID } from 'react-native-dotenv';

GoogleAnalyticsSettings.setDispatchInterval(30);
const tracker = new GoogleAnalyticsTracker(GOOGLE_ANALYTICS_TRACKER_ID);

const analyze = (store, action, handlers) => {
  if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
    return handlers[action.type](store, action);
  }
};

const analytics = store => next => action => {
  analyze(store, action, {
    GET_USER_SUCCESS: () => startApp(action),
    SIGN_IN_SUCCESS: () => startApp(action),
    SIGN_UP_SUCCESS: () => startApp(action),
    DELETE_USER_SUCCESS: () => deleteAccount(action),

    GET_OFFER_SUCCESS: () => trackOffer(action),
    POST_FAVORITE_OFFER_SUCCESS: () => addToFavorites(action),
    DELETE_FAVORITE_OFFER_SUCCESS: () => deleteFromFavotites(action),

    REQUEST_FAIL: () => trackError(action),
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

function trackOffer(action) {
  const { offer } = action.payload;
  const offerPayload = formatOfferPayload(offer);

  tracker.trackEvent(
    'Offer overview',
    'Overview',
    { label: offer.title },
    {
      products: [offerPayload],
      productAction: { action: GA_PRODUCT_ACTIONS.CLICK },
    },
  );
  tracker.trackEvent('Category overview', offer.category);
}

function addToFavorites(action) {
  const { offer } = action.payload;
  const offerPayload = formatOfferPayload(offer);
  tracker.trackEvent(
    'Offer overview',
    'Add to favorites',
    { label: offer.title },
    {
      products: [offerPayload],
      productAction: { action: GA_PRODUCT_ACTIONS.ADD },
    },
  );
}

function deleteFromFavotites(action) {
  const { offer } = action.payload;
  const offerPayload = formatOfferPayload(offer);
  tracker.trackEvent(
    'Offer overview',
    'Delete from favorites',
    { label: offer.title },
    {
      products: [offerPayload],
      productAction: { action: GA_PRODUCT_ACTIONS.REMOVE },
    },
  );
}

export function GA_trackSearch(searchKey, searchValue) {
  let key = 'title';
  if (searchKey === 'category[]') {
    key = 'category';
  } else if (searchKey === 'loc_address') {
    key = 'location';
  }

  tracker.trackEvent('Search', `By ${key}`, { label: searchValue });
}

export function GA_trackShare(offer) {
  tracker.trackEvent('Share', `Success`, { label: offer.id });
}

function trackError(action) {
  tracker.trackEvent('HTTP request fails', 'Error', {
    label: JSON.stringify(action.payload.error)
  });
}

function formatOfferPayload(offer) {
  return {
    id: offer.id,
    name: offer.title,
    category: offer.category,
    brand: offer.business.brandName,
    price: offer.fullPrice,
    couponCode: `Discount - ${offer.discount}`,
  };
}

export default analytics;
