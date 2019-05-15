import { PushNotificationIOS } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { FCM_SENDER_ID } from 'react-native-dotenv';
import store from '@/store';
import { onGenerateToken } from '@/reducers/notifications/actions';

export const configPushNotifications = () => {
  PushNotification.configure({
    onRegister: function(token) {
      store.dispatch(onGenerateToken(token));
    },

    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );

        // process the notification
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    senderID: FCM_SENDER_ID,
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },
    popInitialNotification: true,
    requestPermissions: true,
  });
};

export const localNotification = ({ title, message, bigText = '', actions = null }) => {
  PushNotification.localNotification({
    autoCancel: true,
    largeIcon: 'ic_launcher',
    smallIcon: 'ic_notification',
    bigText: bigText,
    subText: '',
    color: 'red',
    vibrate: true,
    vibration: 300,
    title,
    message,
    playSound: true,
    soundName: 'default',
    actions,
  });
};

export const checkNotificationsPermissions = () => {
  PushNotification.checkPermissions(permissions => {
    console.log('permissions', permissions);
  });
};

const HOUR_IN_MS = 3600000;
const DAY_IN_MS = 86400000;

export const detectAndNotifyAboutExpired = (offers, alreadyNotified) => {
  const expiredIn_24 = [];
  const expiredInHour = [];

  const now = Date.now();

  offers.forEach(offer => {
    if (!offer.past && !alreadyNotified.includes(offer.id)) {
      const endDate = new Date(offer.endDate).getTime();

      if (endDate - now < HOUR_IN_MS) {
        expiredInHour.push(offer.id);
      }
      if (endDate - now < DAY_IN_MS && !expiredInHour.includes(offer.id)) {
        expiredIn_24.push(offer.id);
      }
    }
  });

  if (expiredInHour.length > 0 || expiredIn_24 > 0) {
    const title = 'Expired soon';
    const message = createExpiredNotificationMessage(expiredInHour, expiredIn_24);
    localNotification({ title, message });
  }

  return [...expiredInHour, ...expiredIn_24];
};

const createExpiredNotificationMessage = (expiredInHour, expiredIn_24) => {
  let message = '';
  if (expiredIn_24.length > 0) {
    message += `● ${expiredIn_24.length} offer${expiredIn_24.length > 1 ? 's' : ''} will be expired in less than 24 hours\n`;
  }

  if (expiredInHour.length > 0) {
    message += `● ${expiredInHour.length} offer${expiredInHour.length > 1 ? 's' : ''} will be expired in less than 1 hour`;
  }

  return message;
};
