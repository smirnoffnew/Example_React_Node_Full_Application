import { Toast } from 'native-base';
import toCapitalize from '@/services/helpers/toCapitalize';

/**
 * Renders notification using Toast component from `native-base`
 * @param {string} text - Text which will be shown in notification
 */
export default function throwNotification(text, type = 'default') {
  Toast.show({
    text,
    buttonText: 'OK',
    duration: 5000,
    type,
  });
}

/**
 * Handles errors with array format
 * @param {object} error - Object with `message` key and value as an array of objects with `field` and `message` properties.
 * @returns {string}
 */
const formatNotification = error => {
  const field = error.message[0].field;
  const message = error.message[0].message;

  switch (true) {
    case field === 'mobileNumber':
      return `Mobile number field: ${message}`;
    default:
      return `${toCapitalize(field)} field: ${message}`;
  }
};

/**
 * Handles errors with different formats and extract error messages for notifications.
 * @param {object or string} error - Error which will be shown in notification.
 */
export const notify = error => {

  switch (true) {
    case error === 'Location request timed out':
      throwNotification(`${error}. Please enter your address.`);
      break;
    case typeof error === 'string':
      throwNotification(error);
      break;
    case error.hasOwnProperty('message') && typeof error.message === 'string':
      throwNotification(error.message);
      break;
    case typeof error.message === 'object' && error.message.length > 0:
      throwNotification(formatNotification(error));
      break;
    default:
      throwNotification('Sorry, something went wrong...');
  }
};
