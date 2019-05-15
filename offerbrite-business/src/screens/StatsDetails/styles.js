import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

export default StyleSheet.create({
  container: {
    backgroundColor: appTheme.light,
  },
  statTitle: {
    backgroundColor: appTheme.lightDark,
    paddingHorizontal: '10%',
    paddingVertical: '3%',
    marginBottom: 20,
  },
  chart: {
    height: 250,
    paddingHorizontal: '5%',
  },
});
