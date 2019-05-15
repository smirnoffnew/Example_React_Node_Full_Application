import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

export default StyleSheet.create({
  offerContainer: {
    flexDirection: 'row',
    minHeight: 130,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: null,
    flex: 1,
    resizeMode: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '1%',
    left: -5,
    zIndex: 400,
  },
  expiredBadgeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: 'rgba(43, 43, 43, 0.69)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredBadgeText: {
    color: appTheme.light,
    fontSize: appTheme.textSizes.subtext,
  },
  infoContainer: {
    flex: 2,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});
