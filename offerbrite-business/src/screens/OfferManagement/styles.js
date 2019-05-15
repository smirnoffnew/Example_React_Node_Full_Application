import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const { windowSize } = appTheme;

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingHorizontal: appTheme.paddingHorizontal,
  },
  imageContainer: {
    marginVertical: windowSize * 0.016,
  },
  titleContainer: {
    marginTop: windowSize * 0.05,
  },
  labelContainer: {
    marginVertical: windowSize * 0.016,
  },
  inputContainer: {
    width: '100%',
    height: windowSize * 0.3,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: appTheme.gray,
    borderBottomWidth: 2,
    borderBottomColor: appTheme.default,
    backgroundColor: appTheme.lightDark,
  },
  input: {
    textAlignVertical: 'top',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePicker: {
    width: '40%',
  },
  priceContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceInput: {
    width: '47%',
  },
  discountInput: {
    width: '47%',
  },
  dropDownContainer: {
    marginTop: '3%',
  },
  addressContainer: {
    marginTop: 20,
  },
  buttonsContainer: {
    marginVertical: windowSize * 0.1,
  },
});

export const datePickerStyles = StyleSheet.create({
  dateInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: appTheme.primary,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.primaryLight,
  },
  dateText: {
    color: appTheme.primary,
    fontSize: 12,
  },
});

export default styles;
