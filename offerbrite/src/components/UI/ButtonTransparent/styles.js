import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  left: {
    justifyContent: 'flex-start',
  },
  center: {
    justifyContent: 'center',
  },
  right: {
    justifyContent: 'flex-end',
  },
  button: {
    paddingTop: 7,
    paddingBottom: 2,
    flexShrink: 1,
    borderBottomWidth: 1,
  },
  default: {
    borderColor: appTheme.dark,
  },
  danger: {
    borderColor: appTheme.danger,
  },
  text: {
    fontSize: appTheme.textSizes.subtext,
  },
  textDefault: {
    color: appTheme.dark,
  },
  textDanger: {
    color: appTheme.danger,
  },
});

export default styles;
