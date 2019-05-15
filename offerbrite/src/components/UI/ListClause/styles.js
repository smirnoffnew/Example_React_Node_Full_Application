import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.light,
  },
  listItemContainer: {
    flexDirection: 'column',
  },
  textDanger: {
    fontSize: appTheme.textSizes.regular,
    color: appTheme.danger,
  },
  icon: {
    fontSize: appTheme.textSizes.regular,
  },
  danger: {
    color: appTheme.danger,
  },
  default: {
    color: appTheme.dark,
  },
});

export default styles;
