import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

export default StyleSheet.create({
  container: {
    width: 225,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 10,
  },
  icon: {
    fontSize: appTheme.textSizes.regular,
    color: appTheme.danger,
  },
  textContainer: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  textElement: {
    fontSize: appTheme.textSizes.subtext,
  },
  textRed: {
    color: appTheme.danger,
  },
  textDefault: {
    color: appTheme.darkGray,
  },
});
