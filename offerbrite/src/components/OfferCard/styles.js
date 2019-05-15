import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const cardWidth = appTheme.windowSize * 0.9;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,

    elevation: 3,
  },
  cardBody: {
    width: '100%',
    backgroundColor: appTheme.light,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  imageContainer: {
    width: '100%',
    height: cardWidth / 2,
    position: 'relative',
    backgroundColor: appTheme.light,
  },
  image: {
    flex: 1,
    width: null,
    resizeMode: 'cover',
  },
  buttonsContainer: {
    position: 'absolute',
    top: '5%',
    right: 0,
    zIndex: 400,
  },
  titleContainer: {
    width: '100%',
  },
});

export default styles;
