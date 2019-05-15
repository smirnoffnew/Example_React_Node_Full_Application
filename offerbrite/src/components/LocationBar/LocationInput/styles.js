import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.danger,
    paddingBottom: 10,
  },
  locationInput: {
    height: appTheme.windowSize * 0.1,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '2.5%',
    backgroundColor: appTheme.dangerLight,
    borderRadius: 10,
  },
  iconLeftContainer: {
    marginRight: 10,
  },
  iconRightContainer: {
    marginLeft: 10,
  },
  icon: {
    fontSize: appTheme.textSizes.subtext,
    color: appTheme.light,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    padding: 0,
    color: appTheme.light,
    fontSize: appTheme.textSizes.regular - 3,
  },
});

export default styles;
