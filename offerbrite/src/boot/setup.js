import React, { Component } from 'react';
import { Provider } from 'react-redux';

import App from '@/App';
import store from '@/store';

import { configPushNotifications } from '@/services/pushNotifications';

configPushNotifications();

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      store,
    };
  }

  render() {
    return (
      <Provider store={this.state.store}>
        <App />
      </Provider>
    );
  }
}
