import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

export default StyleSheet.create({
  container: {
    backgroundColor: appTheme.light,
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flexShrink: 1,
    paddingTop: '10%',
    paddingBottom: '5%',
    paddingHorizontal: '15%',
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: '2.5%',
  },
  buttonContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: '10%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: appTheme.danger,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHeaderTextContainer: {
    flex: 6,
  },
  modalCloseButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseButtonIcon: {
    fontSize: 20,
    color: appTheme.light,
  },
  modalContent: {
    flex: 1,
  },
});
