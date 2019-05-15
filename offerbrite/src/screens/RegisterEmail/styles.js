import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  inputContainer: {
    marginTop: appTheme.windowSize * 0.18,
  },
  buttonContainer: {
    marginBottom: appTheme.windowSize * 0.1,
  },
});

export default styles;
