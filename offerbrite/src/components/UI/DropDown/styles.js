import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  button: {
    width: '90%',
    marginHorizontal: '5%',
    borderWidth: 1,
    borderColor: appTheme.danger,
    borderRadius: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: appTheme.windowSize * 0.02,
  },
  textContent: {
    fontSize: appTheme.textSizes.regular - 3,
    color: appTheme.danger,
  },
  icon: {
    marginLeft: 15,
    fontSize: appTheme.textSizes.regular - 3,
    color: appTheme.danger,
  },
  animationContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dropDownContent: {
    width: '90%',
    marginHorizontal: '5%',
    borderColor: appTheme.lightDark,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: appTheme.light,
  },
  dropDownItem: {
    alignItems: 'center',
    paddingVertical: appTheme.windowSize * 0.02,
    borderColor: appTheme.lightDark,
    borderWidth: 1,
  },
});

export default styles;
