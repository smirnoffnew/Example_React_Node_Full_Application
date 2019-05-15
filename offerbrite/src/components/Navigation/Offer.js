import { createStackNavigator } from 'react-navigation';

import OfferPreview from '@/screens/OfferPreview';
import MapScreen from '@/screens/MapScreen';
import Report from '@/screens/Report';

const OfferStack = createStackNavigator(
  {
    OfferPreview: { screen: OfferPreview },
    MapScreen: { screen: MapScreen },
    Report: { screen: Report },
  },
  {
    initialRouteName: 'OfferPreview',
  },
);

export default OfferStack;
