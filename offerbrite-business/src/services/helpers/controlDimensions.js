import { Dimensions } from 'react-native';

/**
 * Returns short breakpoint identifier depending on device's width
 * @returns {string}
 */
export const getScreenSize = () => {
  const screenSize = Dimensions.get('window').width;

  switch (true) {
    case screenSize < 400:
      return 'xs';
    case screenSize < 600:
      return 'sm';
    case screenSize < 768:
      return 'md';
    default:
      return 'lg';
  }
};

/**
 * Returns height of device screen
 * @returns {number}
 */
export const getScreenHeight = () => Dimensions.get('window').height;

/**
 * Returns width of device screen
 * @returns {number}
 */
export const getScreenWidth = () => Dimensions.get('window').width;

/**
 * Returns the state of device's view - horizontal/vertical
 * @returns {string}
 */
export const getViewMode = () => getScreenWidth() > getScreenHeight() ? 'landscape' : 'portrait';
