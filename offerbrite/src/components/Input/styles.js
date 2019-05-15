import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  inputContainer: {
    paddingBottom: appTheme.windowSize * 0.025,
    position: 'relative',
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
    borderColor: appTheme.danger,
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
  eyeIcon: {
    fontSize: appTheme.textSizes.regular - 2,
    color: appTheme.default,
  },
});

export default styles;
