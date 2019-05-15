import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: appTheme.lightDark,
  },
  dropDownAnimationContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: appTheme.lightDark,
  },
});

export default styles;
