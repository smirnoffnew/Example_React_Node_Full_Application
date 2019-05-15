import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  header: {
    backgroundColor: appTheme.primary,
  },
  backButton: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular,
  },
  addButton: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular,
  },
  profileButton: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regularSmall,
  },
  headerLeft: { flex: 1 },
  headerRight: { flex: 1 },
  headerBody: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular,
  },
});

export default styles;
