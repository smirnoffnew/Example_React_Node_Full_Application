import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: '5%',
    backgroundColor: appTheme.danger,
  },
  searchContainer: {
    flex: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: appTheme.light,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: appTheme.default,
    fontSize: appTheme.textSizes.regular,
  },
  inputContainer: {
    flex: 5,
  },
  input: {
    paddingVertical: 5,
    fontSize: appTheme.textSizes.regular - 3,
  },
  button: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular - 3,
  },
});

export default styles;
