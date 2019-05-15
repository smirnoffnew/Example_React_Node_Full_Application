import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: appTheme.windowSize * 0.1,
  },
  buttonContainer: {
    marginTop: appTheme.windowSize * 0.05,
  },
  bottomTextContainer: {
    alignItems: 'center',
    marginTop: appTheme.windowSize * 0.05,
  },
  bottomSpace: {
    height: appTheme.windowSize * 0.05,
  },
});

export default styles;
