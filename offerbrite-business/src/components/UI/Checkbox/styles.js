import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const unifiedSize = appTheme.windowSize * 0.08;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'center',
  },
  left: {
    justifyContent: 'flex-start',
  },
  right: {
    justifyContent: 'flex-end',
  },
  checkbox: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
  },
  iconContainerOuter: {
    width: unifiedSize,
    height: unifiedSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: appTheme.primary,
  },
  iconContainerInner: {
    justifyContent: 'center',
    alignItems: 'center',
    width: unifiedSize - 5,
    height: unifiedSize - 5,
    borderRadius: 3,
  },
  primary: {
    backgroundColor: appTheme.primary,
  },
  light: {
    backgroundColor: appTheme.light,
  },
  icon: {
    fontSize: unifiedSize - 10,
    color: appTheme.light,
  },
});

export default styles;
