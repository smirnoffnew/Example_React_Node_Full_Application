import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { View } from 'native-base';
import ListClause from '@/components/UI/ListClause';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import { actions as editProfileActions } from '@/reducers/editProfile';
import { selectors as sessionSelectors } from '@/reducers/session';

class NotificationUpdate extends Component {

  state = {
    notificationStateOpened: false,
  }

  _onNotificationPressHandler = () => {
    this.setState(prevState => ({ notificationStateOpened: !prevState.notificationStateOpened }));
  }


  render() {
    const { user, onToggleNotifications } = this.props;
    const { notificationStateOpened } = this.state;

    return (
      <Fragment>
        <ListClause
          onPress={this._onNotificationPressHandler}
          content="Notification"
          editing={notificationStateOpened}
        />
        {
          notificationStateOpened ?
            <View style={styles.dropDownAnimationContainer}>
              <Animatable.View
                animation="fadeInDownBig"
                duration={300}
                style={styles.buttonContainer}
              >
                <ButtonRounded
                  theme="danger"
                  square
                  onPress={onToggleNotifications}
                >
                  {user.isNotificationsEnabled ? 'Turn off' : 'Turn on'}
                </ButtonRounded>
              </Animatable.View>
            </View> :
            null
        }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: sessionSelectors.user(state),
});

const mapDispatchToProps = dispatch => ({
  onToggleNotifications: () => dispatch(editProfileActions.onToggleNotifications()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationUpdate);
