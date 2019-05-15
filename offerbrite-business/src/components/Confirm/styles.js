import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modal: {
    marginHorizontal: '10%',
    width: '80%',
    minHeight: 80,
    maxWidth: 500,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: appTheme.light,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelButtonText: {
    fontSize: 15,
    color: appTheme.danger,
  },
  confirmButtonText: {
    fontSize: 15,
    color: appTheme.green,
  },
});
