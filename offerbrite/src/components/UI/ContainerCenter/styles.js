import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const maxWidth = DeviceInfo.isTablet() || DeviceInfo.isLandscape()
  ? 650
  : '100%';

export default StyleSheet.create({
  container: {
    width: '100%',
    maxWidth,
  },
});
