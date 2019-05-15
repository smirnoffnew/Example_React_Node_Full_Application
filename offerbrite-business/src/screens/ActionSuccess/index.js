import React, { Component } from 'react';

import { Container, Icon } from 'native-base';
import TextContent from '@/components/TextContent';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

const routeController = {
  ForgotPassword: {
    message: 'Email address has been sent. To recover your password, click on the link that we sent to the specified email',
    redirectTo: 'SignIn',
  },
};

class ActionSuccess extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.fromRoute = this.props.navigation.getParam('fromRoute');
  }

  _onRedirect = () => {
    this.props.navigation.navigate(routeController[this.fromRoute].redirectTo);
  }

  render() {
    return (
      <Container style={styles.container}>
        <Icon
          name="checkmark-circle"
          style={styles.icon}
        />
        <TextContent
          type="subtext"
          style={styles.textContainer}
        >
          {routeController[this.fromRoute].message}
        </TextContent>
        <ButtonRounded
          onPress={this._onRedirect}
          theme="primary"
        >
          Ok
        </ButtonRounded>
      </Container>
    );
  }
}

export default ActionSuccess;
