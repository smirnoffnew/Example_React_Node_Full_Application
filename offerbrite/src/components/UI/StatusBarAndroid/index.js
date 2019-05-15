import React from 'react';
import { Platform, StatusBar } from 'react-native';
import appTheme from '@/theme';

export default function StatusBarAndroid() {
  const component = Platform.OS === 'android' ?
    <StatusBar
      barStyle="light-content"
      hidden={false}
      backgroundColor={appTheme.dangerDark}
      translucent={false}
    /> :
    null;

  return component;
}
