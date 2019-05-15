import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import appTheme from '@/theme';

import Offers from '@/screens/Offers';
import OfferManagement from '@/screens/OfferManagement';
import OfferPreview from '@/screens/OfferPreview';
import Stats from '@/screens/Stats';
import StatsDetails from '@/screens/StatsDetails';
import Profile from '@/screens/Profile';
import EditProfile from '@/screens/EditProfile';

const OffersStack = createStackNavigator(
  {
    Offers: { screen: Offers },
    OfferManagement: { screen: OfferManagement },
    OfferPreview: { screen: OfferPreview },
  },
  {
    initialRouteName: 'Offers',
  }
);

const StatsStack = createStackNavigator(
  {
    Stats: { screen: Stats },
    StatsDetails: { screen: StatsDetails },
  },
  {
    initialRouteName: 'Stats',
  }
);

const ProfileStack = createStackNavigator(
  {
    Profile: { screen: Profile },
    EditProfile: { screen: EditProfile },
  },
  {
    initialRouteName: 'Profile',
  }
);

const App = createBottomTabNavigator(
  {
    Offers: {
      screen: OffersStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="md-home"
            type="ionicon"
            color={tintColor}
            size={appTheme.tabBarIconSize}
          />
        ),
      },
    },
    Statistics: {
      screen: StatsStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="md-stats"
            type="ionicon"
            color={tintColor}
            size={appTheme.tabBarIconSize}
          />
        ),
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="person"
            type="material"
            color={tintColor}
            size={appTheme.tabBarIconSize}
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'Offers',
    tabBarOptions: {
      activeTintColor: appTheme.primary,
      inactiveTintColor: appTheme.default,
      labelStyle: {
        fontSize: appTheme.windowSize * 0.025,
      },
      style: {
        paddingTop: 5,
      },
    },
  },
);

export default App;
