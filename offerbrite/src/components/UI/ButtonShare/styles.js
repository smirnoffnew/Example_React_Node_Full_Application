import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const shareButtonSize = appTheme.windowSize * 0.085;
const actionButtonSize = appTheme.windowSize * 0.07;

const styles = StyleSheet.create({
  container: {
    width: shareButtonSize + 2,
    height: shareButtonSize + 2,
    alignItems: 'center',
  },
  shareButton: {
    height: shareButtonSize,
    width: shareButtonSize,
    borderRadius: shareButtonSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: shareButtonSize / 2,
    elevation: 1,
  },
  shareIcon: {
    fontSize: appTheme.textSizes.regular,
    color: appTheme.default,
  },
  actionButton: {
    width: actionButtonSize,
    height: actionButtonSize,
    marginTop: actionButtonSize / 3,
    borderRadius: actionButtonSize / 2,
    backgroundColor: appTheme.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
