import React, { Fragment } from 'react';
import { createSwitchNavigator } from 'react-navigation';
import { StyleProvider, Root } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';

import AuthLoadingStack from '@/components/Navigation/AuthLoading';
import AuthStack from '@/components/Navigation/Auth';
// import VerificationStack from '@/components/Navigation/Verification';
import AppStack from '@/components/Navigation/App';
import Notification from '@/components/Notification';

import StatusBarAndroid from '@/components/UI/StatusBarAndroid';

const App = createSwitchNavigator({
  AuthLoading: AuthLoadingStack,
  Auth: AuthStack,
  // TEMP: verification turned off
  // Verification: VerificationStack,
  App: AppStack,
});

export default () => (
  <Root>
    <StyleProvider style={getTheme(material)}>
      <Fragment>
        <StatusBarAndroid />
        <App />
        <Notification />
      </Fragment>
    </StyleProvider>
  </Root>
);
