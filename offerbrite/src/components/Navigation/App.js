import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Home from '@/screens/Home';
import Search from '@/screens/Search';
import Favorites from '@/screens/Favorites';
import Profile from '@/screens/Profile';
import EditProfile from '@/screens/EditProfile';

import appTheme from '@/theme';

const HomeStack = createStackNavigator(
  {
    Home: { screen: Home },
  },
  {
    initialRouteName: 'Home',
  },
);

const SearchStack = createStackNavigator(
  {
    Search: { screen: Search },
  },
  {
    initialRouteName: 'Search',
  },
);

const FavoritesStack = createStackNavigator(
  {
    Favorites: { screen: Favorites },
  },
  {
    initialRouteName: 'Favorites',
  },
);

const ProfileStack = createStackNavigator(
  {
    Profile: { screen: Profile },
    EditProfile: { screen: EditProfile },
  },
  {
    initialRouteName: 'Profile',
  },
);

const App = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
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
    Search: {
      screen: SearchStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name="search"
            type="material"
            color={tintColor}
            size={appTheme.tabBarIconSize}
          />
        ),
      },
    },
    Favorites: {
      screen: FavoritesStack,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => (
          <Icon
            name={focused ? 'star' : 'star-outlined'}
            type="entypo"
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
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: appTheme.danger,
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
