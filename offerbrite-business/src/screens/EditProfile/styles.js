import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.lightDark,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    paddingVertical: appTheme.windowSize * 0.04,
    alignItems: 'center',
    backgroundColor: appTheme.primary,
  },
});

export default styles;
