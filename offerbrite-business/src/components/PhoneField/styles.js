import { StyleSheet, PixelRatio } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  countrySelectorContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appTheme.windowSize * 0.025,
    marginRight: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderColor: appTheme.default,
  },
  countrySelector: {},
  callingCodeContainer: {
    paddingVertical: appTheme.windowSize * 0.015,
  },
  inputContainer: {
    flex: 7,
    marginBottom: appTheme.windowSize * 0.025,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    paddingVertical: appTheme.windowSize * 0.015,
    paddingLeft: 0,
    fontSize: appTheme.textSizes.regular,
    color: '#000',
    flex: 9,
  },
  inputOnFocus: {
    borderColor: appTheme.primary,
    borderBottomWidth: 2,
  },
  inputOnBlur: {
    borderColor: appTheme.default,
    borderBottomWidth: 2,
  },
  additionalContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  eraseIcon: {
    fontSize: appTheme.textSizes.regular + 6,
    color: '#000',
  },
  trashIcon: {
    fontSize: appTheme.textSizes.regular,
    color: appTheme.darkLight,
  },
});

export const countryPickerStyle = StyleSheet.create({
  touchFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    height: appTheme.windowSize * 0.05,
  },
  imgStyle: {
    resizeMode: 'contain',
    width: appTheme.windowSize * 0.066,
    height: appTheme.windowSize * 0.05,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#eee',
    opacity: 1,
  },
});

export default styles;
