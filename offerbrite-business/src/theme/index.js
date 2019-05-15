import { Dimensions, PixelRatio } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const size = screenWidth > screenHeight ? screenHeight : screenWidth;
const ratio = PixelRatio.get();
const absoluteSize = size / ratio;

const textSizes = {
  regular: absoluteSize * 0.05 + ratio * 4,
  regularSmall: absoluteSize * 0.045 + ratio * 4,
  subtext: absoluteSize * 0.025 + ratio * 4,
  small: absoluteSize * 0.018 + ratio * 4,
};

const paddingHorizontal = size * 0.1;

export default {
  windowSize: size,
  paddingHorizontal,
  textSizes,
  tabBarIconSize: 24,
  light: '#fff',
  lightDark: '#eee',
  dark: '#000',
  primary: '#0461ec',
  primaryDark: '#071d6d',
  primaryLight: '#cfe0fa',
  danger: '#ca212e',
  dangerLight: '#e03e4a',
  dangerDark: '#9a131d',
  default: '#919191',
  disabled: '#555',
  gray: '#ccc',
  darkGray: '#474747',
  green: '#2acc64',
};
