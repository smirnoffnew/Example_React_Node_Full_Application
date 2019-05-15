import { createStackNavigator } from 'react-navigation';

import SplashScreen from '@/screens/SplashScreen';

const AuthLoadingStack = createStackNavigator(
  {
    SplashScreen: { screen: SplashScreen },
  },
  {
    initialRouteName: 'SplashScreen',
  }
);

export default AuthLoadingStack;
