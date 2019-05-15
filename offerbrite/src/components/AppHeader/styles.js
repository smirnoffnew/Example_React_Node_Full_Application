import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  header: {
    backgroundColor: appTheme.danger,
  },
  backButton: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular,
  },
  headerLeft: { flex: 1 },
  headerRight: { flex: 1 },
  headerBody: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular,
  },
});

export default styles;
