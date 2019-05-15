import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import Background from './components/Background';
import HomePage from './containers/HomePage';
import PasswordRecovery from './containers/PasswordRecovery';
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Background>
        <Switch>
          <Route path="/business-users/reset-password" render={(props) => <PasswordRecovery businessRoute {...props} />} />
          <Route path="/reset-password" component={PasswordRecovery} />
          <Route path="/" component={HomePage} />
        </Switch>
      </Background>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
