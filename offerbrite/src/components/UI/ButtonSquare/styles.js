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
  buttonDanger: {
    borderColor: appTheme.light,
    backgroundColor: appTheme.danger,
  },
  buttonLight: {
    borderColor: appTheme.danger,
    backgroundColor: appTheme.light,
  },
  buttonGray: {
    borderColor: appTheme.default,
    backgroundColor: appTheme.light,
  },
  text: {
    fontSize: appTheme.textSizes.subtext,
  },
  textLight: {
    color: appTheme.light,
  },
  textDanger: {
    color: appTheme.danger,
  },
  textGray: {
    color: appTheme.default,
  },
  icon: {
    fontSize: appTheme.textSizes.regular,
    marginRight: 10,
  },
  iconDanger: {
    color: appTheme.light,
  },
  iconLight: {
    color: appTheme.danger,
  },
});

export default styles;
