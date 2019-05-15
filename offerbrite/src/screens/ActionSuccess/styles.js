import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: appTheme.windowSize * 0.5,
    color: appTheme.primary,
  },
  textContainer: {
    paddingHorizontal: appTheme.paddingHorizontal,
    marginVertical: 20,
  },
});

export default styles;
