import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const unifiedSize = appTheme.windowSize * 0.1;

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
  iconContainer: {
    width: unifiedSize,
    height: unifiedSize,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: appTheme.danger,
    borderRadius: 5,
  },
  icon: {
    fontSize: unifiedSize,
    color: appTheme.danger,
  },
});

export default styles;
