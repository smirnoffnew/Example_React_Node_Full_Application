import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  normalHeight: {
    paddingVertical: appTheme.windowSize * 0.037,
  },
  smallHeight: {
    paddingVertical: appTheme.windowSize * 0.02,
  },
  buttonPrimary: {
    borderColor: appTheme.light,
    backgroundColor: appTheme.primary,
  },
  buttonLight: {
    borderColor: appTheme.primary,
    backgroundColor: appTheme.light,
  },
  buttonGray: {
    borderColor: appTheme.default,
    backgroundColor: appTheme.light,
  },
  buttonDanger: {
    borderColor: appTheme.dangerDark,
    backgroundColor: appTheme.danger,
  },
  text: {
    fontSize: appTheme.textSizes.subtext,
  },
  textLight: {
    color: appTheme.light,
  },
  textPrimary: {
    color: appTheme.primary,
  },
  textGray: {
    color: appTheme.default,
  },
  icon: {
    fontSize: appTheme.textSizes.regular,
    marginRight: 10,
  },
  iconPrimary: {
    color: appTheme.light,
  },
  iconLight: {
    color: appTheme.primary,
  },
});

export default styles;
