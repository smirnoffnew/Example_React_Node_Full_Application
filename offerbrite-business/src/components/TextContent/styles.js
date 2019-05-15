import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  regular: {
    fontSize: appTheme.textSizes.regular,
  },
  regularSmall: {
    fontSize: appTheme.textSizes.regularSmall,
  },
  subtext: {
    fontSize: appTheme.textSizes.subtext,
  },
  small: {
    fontSize: appTheme.textSizes.small,
  },
  error: {
    color: appTheme.danger,
    fontSize: appTheme.textSizes.subtext,
  },
});

export default styles;
