import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const size = Math.round(appTheme.windowSize * 0.05);

export default StyleSheet.create({
  button: {
    fontSize: size,
    color: appTheme.danger,
    marginRight: size - 5,
  },
});
