import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container, Content, List } from 'native-base';
import AppHeader from '@/components/AppHeader';
import ListClause from '@/components/UI/ListClause';
import ListClauseSeparator from '@/components/UI/ListClauseSeparator';
import NotificationUpdate from '@/components/Forms/NotificationUpdate';
import styles from './styles';

import { actions as sessionActions, selectors as sessionSelectors } from '@/reducers/session';
import { actions as editProfileActions } from '@/reducers/editProfile';
import { GA_trackScreen } from '@/services/analytics';

class Profile extends Component {
  static navigationOptions = {
    header: <AppHeader screenTitle="Profile" type="empty" />,
  }

  componentDidMount() {
    GA_trackScreen('Profile');
  }

  componentDidUpdate(prevProps) {
    if (prevProps && !this.props.user) {
      this.props.navigation.navigate('SignIn');
    }
  }

  _onEditPressHandler = () => {
    this.props.setInitialUserForUpdate();
    this.props.navigation.navigate('EditProfile');
  }

  _handleLogout = () => {
    this.props.navigation.navigate('AuthLoading');
    this.props.logout();
  }

  render() {
    const { user } = this.props;

    return (
      <Container style={styles.container}>
        <Content>
          <List>
            <ListClauseSeparator>User information</ListClauseSeparator>
            <ListClause
              disabled
              title="Name"
              content={user ? user.username : ''}
            />
            <ListClause
              disabled
              title="Email"
              content={user ? user.email : ''}
            />
            <ListClauseSeparator>Additional information</ListClauseSeparator>
            <ListClause
              onPress={() => alert('Will be added soon')}
              content="Privacy policy"
            />
            <ListClause
              onPress={() => alert('Will be added soon')}
              content="Acknowledgment"
            />
            <NotificationUpdate />
            <ListClauseSeparator />
            <ListClause
              onPress={this._onEditPressHandler}
              content="Edit profile"
            />
            <ListClauseSeparator />
            <ListClause
              onPress={this._handleLogout}
              content="Log out"
              danger
            />
          </List>
        </Content>
      </Container>
    );
  }
}

Profile.defaultProps = {
  user: {
    username: 'User',
    email: 'example@email.com',
  },
};

const mapStateToProps = state => ({
  user: sessionSelectors.user(state),
});

const mapDispatchToProps = dispatch => ({
  setInitialUserForUpdate: () => dispatch(editProfileActions.setInitialUserForUpdate()),
  logout: () => dispatch(sessionActions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
