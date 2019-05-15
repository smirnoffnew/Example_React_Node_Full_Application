import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  header: {
    backgroundColor: appTheme.light,
  },
  backButton: {
    color: appTheme.dark,
    fontSize: appTheme.textSizes.regular,
  },
  headerLeft: { flex: 1 },
  headerRight: { flex: 1 },
  headerBody: {
    flex: 5,
    alignItems: 'center',
  },
  title: {
    color: appTheme.dark,
    fontSize: appTheme.textSizes.regular,
  },
});

export default styles;
