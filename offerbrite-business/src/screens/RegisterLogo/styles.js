import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginTop: appTheme.windowSize * 0.04,
    alignItems: 'center',
  },
  textContainer: {
    marginTop: appTheme.windowSize * 0.034,
  },
  buttonContainer: {
    marginVertical: appTheme.windowSize * 0.1,
  },
});

export default styles;
