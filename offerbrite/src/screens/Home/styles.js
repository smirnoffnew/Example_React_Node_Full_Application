import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: appTheme.lightDark,
  },
  locationInputContainer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 300,
  },
  content: {
    alignItems: 'center',
    marginTop: appTheme.windowSize * 0.1 + 40,
    paddingBottom: 80,
  },
  itemContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: 5,
  },
  offersContainer: {
    marginTop: appTheme.windowSize * 0.1 + 40,
  },
  textContainer: {
    width: '60%',
    margin: '20%',
    alignItems: 'center',
  },
});

export default styles;
