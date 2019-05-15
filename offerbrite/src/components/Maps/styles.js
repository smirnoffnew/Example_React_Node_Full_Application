import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    fontSize: 40,
    color: appTheme.danger,
  },
});
