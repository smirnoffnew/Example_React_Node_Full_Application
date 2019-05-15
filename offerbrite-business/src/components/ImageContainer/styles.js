import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const editIconContainerSize = appTheme.windowSize * 0.1;
const editIconContainerHalfSize = editIconContainerSize / 2;
const imageCircleSize = appTheme.windowSize * 0.47;
const imageCircleHalfSize = imageCircleSize / 2;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    // maxWidth: 400,
  },
  withBorder: {
    borderWidth: 1,
    borderColor: appTheme.primary,
  },
  imageContainer: {
    backgroundColor: appTheme.primaryLight,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: imageCircleSize,
    height: imageCircleSize,
    borderRadius: imageCircleHalfSize,
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  editIconContainer: {
    position: 'absolute',
    zIndex: 3,
    top: '50%',
    right: 0,
    transform: [
      { translateX: editIconContainerHalfSize },
      { translateY: -editIconContainerHalfSize },
    ],
    width: editIconContainerSize,
    height: editIconContainerSize,
    borderWidth: 1,
    borderColor: appTheme.primary,
    borderRadius: editIconContainerHalfSize,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.light,
  },
  editIcon: {
    fontSize: appTheme.textSizes.subtext,
    color: appTheme.primary,
  },
});

export default styles;
