import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.lightDark,
  },
  logoContainer: {
    paddingVertical: appTheme.windowSize * 0.04,
    alignItems: 'center',
    backgroundColor: appTheme.primary,
  },
  buttonsContainer: {
    margin: appTheme.windowSize * 0.1,
  },
});

export default styles;
