import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container } from 'native-base';
import Logo from '@/components/UI/Logo';
import StatusBarAndroid from '@/components/UI/StatusBarAndroid';
import styles from './styles';

import { actions as sessionActions, selectors as sessionSelectors } from '@/reducers/session';

class SplashScreen extends Component {
  static navigationOptions = {
    header: null,
  }

  componentDidMount() {
    this.props.bootstrap();
    this.timeout = setTimeout(() => {
      if (this.props.isAuthenticated) {
        this.props.navigation.navigate('App');
      } else {
        this.props.navigation.navigate('SignIn');
      }
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <Container style={styles.container}>
        <StatusBarAndroid />
        <Logo color="white" />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: sessionSelectors.isAuthenticated(state),
});

const mapDispatchToProps = dispatch => ({
  bootstrap: () => dispatch(sessionActions.bootstrap()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
