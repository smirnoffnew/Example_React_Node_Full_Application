import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    backgroundColor: appTheme.danger,
  },
  search: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
    backgroundColor: appTheme.danger,
  },
  searchContainer: {
    flex: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '2.5%',
    borderRadius: 10,
    backgroundColor: appTheme.light,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    color: appTheme.default,
    fontSize: appTheme.textSizes.subtext,
  },
  inputContainer: {
    flex: 5,
  },
  input: {
    paddingVertical: 5,
    paddingHorizontal: 0,
    fontSize: appTheme.textSizes.regular - 3,
  },
  button: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  buttonText: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular - 3,
  },
});

export default styles;
