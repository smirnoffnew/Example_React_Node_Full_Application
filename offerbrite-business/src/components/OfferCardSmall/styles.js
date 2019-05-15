import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  offerContainer: {
    width: '100%',
    flexDirection: 'row',
    minHeight: 130,
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: null,
    flex: 1,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 2,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
});
