import { StyleSheet } from 'react-native';
import appTheme from '@/theme';

const { windowSize } = appTheme;

const horizontalPaddingSize = windowSize * 0.042;

const styles = StyleSheet.create({
  content: {
    // flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: horizontalPaddingSize,
    marginTop: 20,
    paddingBottom: 50,
  },
  segmentContainer: {
    width: '100%',
    paddingHorizontal: horizontalPaddingSize,
    alignItems: 'center',
  },
  itemContainer: {
    width: '100%',
    alignItems: 'center',
  },
  segment: {
    marginTop: windowSize * 0.021,
    maxWidth: 500,
    width: '100%',
  },
  buttonContainer: {
    width: '50%',
    alignSelf: 'center',
  },
  instructionsContainer: {
    marginVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
