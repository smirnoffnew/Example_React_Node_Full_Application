import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const { windowSize } = appTheme;

const styles = StyleSheet.create({
  descriptionContainer: {
    marginVertical: windowSize * 0.04,
  },
  imageContainer: {
    marginVertical: windowSize * 0.016,
  },
  labelContainer: {
    marginBottom: windowSize * 0.016,
  },
  inputContainer: {
    width: '100%',
    height: windowSize * 0.3,
    borderBottomWidth: 2,
    borderColor: appTheme.default,
    marginBottom: windowSize * 0.1,
  },
  input: {
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  buttonContainer: {
    marginBottom: windowSize * 0.05,
  },
});

export default styles;
