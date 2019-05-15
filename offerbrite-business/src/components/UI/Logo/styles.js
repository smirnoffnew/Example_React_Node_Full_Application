import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    width: appTheme.windowSize * 0.47,
    height: appTheme.windowSize * 0.53,
  },
  logo: {
    resizeMode: 'contain',
    width: null,
    flex: 1,
  },
});

export default styles;
