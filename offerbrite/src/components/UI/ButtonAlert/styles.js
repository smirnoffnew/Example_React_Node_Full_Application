import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const buttonSize = appTheme.windowSize * 0.085;

const styles = StyleSheet.create({
  container: {
    width: buttonSize + 2,
    height: buttonSize + 2,
    alignItems: 'center',
  },
  button: {
    height: buttonSize,
    width: buttonSize,
    borderRadius: buttonSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: buttonSize / 2,
    elevation: 1,
  },
  icon: {
    fontSize: appTheme.textSizes.regular,
    color: appTheme.default,
  },
});

export default styles;
