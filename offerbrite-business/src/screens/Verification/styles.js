import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.primary,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-around',
  },
  textContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: appTheme.windowSize * 0.1,
  },
});

export default styles;
