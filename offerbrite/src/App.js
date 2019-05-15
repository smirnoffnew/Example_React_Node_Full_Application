import React, { Fragment } from 'react';
import { createSwitchNavigator } from 'react-navigation';
import { StyleProvider, Root } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';

import AuthLoadingStack from '@/components/Navigation/AuthLoading';
import AuthStack from '@/components/Navigation/Auth';
import AppStack from '@/components/Navigation/App';
import OfferStack from '@/components/Navigation/Offer';

import Notification from '@/components/Notification';

const App = createSwitchNavigator({
  AuthLoading: AuthLoadingStack,
  Auth: AuthStack,
  App: AppStack,
  Offer: OfferStack,
});

export default () => (
  <Root>
    <StyleProvider style={getTheme(material)}>
      <Fragment>
        <App />
        <Notification />
      </Fragment>
    </StyleProvider>
  </Root>
);
