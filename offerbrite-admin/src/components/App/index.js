import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Header from 'components/Header';
import SideBar from 'components/SideBar';
import Spinner from 'components/UI/Spinner';
import Content from 'components/UI/Content';

import Login from 'containers/Login';
import Users from 'containers/Users';
import Companies from 'containers/Companies';
import Offers from 'containers/Offers';
import Notifications from 'containers/Notifications';
import Analytics from 'containers/Analytics';
import Settings from 'containers/Settings';
import Reports from 'containers/Reports';

import styles from './styles.module.scss';

import { actions as sessionActions } from 'reducers/session';
import { actions as settingsActions } from 'reducers/settings';
import { actions as reportsActions } from 'reducers/reports';
import { actions as offersActions } from 'reducers/offers';

class App extends Component {

  componentDidMount() {
    this.props.bootstrap();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.access.token && this.props.access.token) {
      const storedSettings = localStorage.getItem('settings');
      if (storedSettings) {
        this.props.setSettingsFromStorage(storedSettings);
      }
      this.props.getReports();
      this.props.getCategories();
    }
  }

  render() {
    const { access } = this.props;

    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/admin/login" component={Login} />
          {
            access.token &&
            <div className={styles.App}>
              <SideBar />
              <Spinner />
              <div className={styles.App__content}>
                <Header />
                <Content>
                  <Route path="/admin/users" component={Users} />
                  <Route path="/admin/companies" component={Companies} />
                  <Route path="/admin/offers" component={Offers} />
                  <Route path="/admin/notifications" component={Notifications} />
                  <Route path="/admin/analytics" component={Analytics} />
                  <Route path="/admin/settings" component={Settings} />
                  <Route path="/admin/reports" component={Reports} />
                </Content>
              </div>
            </div>
          }
          <Redirect from="/admin" to="/admin/login" />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
  access: state.session.access,
});

const mapDispatchToProps = dispatch => ({
  bootstrap: () => dispatch(sessionActions.bootstrap()),
  setSettingsFromStorage: settings => dispatch(settingsActions.setSettingsFromStorage(settings)),
  getReports: () => dispatch(reportsActions.getReports()),
  getCategories: () => dispatch(offersActions.getCategories()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
