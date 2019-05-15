import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.light,
  },
  listItemContainer: {
    flexDirection: 'column',
  },
  textPrimary: {
    fontSize: appTheme.textSizes.regular,
    color: appTheme.primary,
  },
  icon: {
    fontSize: appTheme.textSizes.regular,
  },
  primary: {
    color: appTheme.primary,
  },
  default: {
    color: appTheme.dark,
  },
});

export default styles;
