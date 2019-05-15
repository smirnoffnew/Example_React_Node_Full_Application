import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: '2%',
    borderWidth: 1,
    borderColor: appTheme.primary,
  },
  left: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  right: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  active: {
    backgroundColor: appTheme.primary,
  },
  default: {
    backgroundColor: appTheme.light,
  },
  text: {
    fontSize: appTheme.textSizes.subtext,
  },
  textActive: {
    color: appTheme.light,
  },
  textDefault: {
    color: appTheme.primary,
  },
});

export default styles;
