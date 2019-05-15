import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginBottom: appTheme.windowSize * 0.1,
  },
});

export default styles;
