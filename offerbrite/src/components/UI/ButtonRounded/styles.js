import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    minWidth: '62%',
    paddingVertical: appTheme.textSizes.subtext + 2,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  rounded: {
    borderRadius: 100,
  },
  square: {
    borderRadius: 5,
  },
  danger: { backgroundColor: appTheme.danger },
  primary: { backgroundColor: appTheme.primary },
  disabled: { backgroundColor: appTheme.disabled },
  text: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.subtext,
  },
});

export default styles;
