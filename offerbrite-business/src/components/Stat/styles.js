import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

export default StyleSheet.create({
  statTitle: {
    backgroundColor: appTheme.lightDark,
    paddingHorizontal: '10%',
    paddingVertical: '3%',
  },
  statsContent: {
    paddingHorizontal: '10%',
    paddingVertical: '5%',
  },
  statsLabel: {
    marginBottom: 2,
  },
  statsCount: {
    color: appTheme.darkGray,
    fontSize: appTheme.textSizes.regular + 4,
  },
});
