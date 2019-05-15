import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.primary,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 7,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    fontSize: appTheme.textSizes.regular,
    color: appTheme.light,
  },
});

export default styles;
