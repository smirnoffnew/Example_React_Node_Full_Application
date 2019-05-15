import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container, View, Text } from 'native-base';
import Logo from '@/components/UI/Logo';
import styles from './styles';

import { actions as sessionActions, selectors as sessionSelectors } from '@/reducers/session';
import { selectors as businessSelectors } from '@/reducers/business';

class SplashScreen extends Component {
  static navigationOptions = {
    header: null,
  }

  async componentDidMount() {
    const {
      bootstrap,
      isAuthenticated,
      businessItem,
      navigation,
      requestCameraPermission,
    } = this.props;

    await requestCameraPermission();
    await bootstrap();
    this.timeout = await setTimeout(() => {
      // TEMP: verification turned off
      /*
      if (isAuthenticated) {
        businessItem.hasOwnProperty('isVerified') && businessItem.isVerified ?
          navigation.navigate('App') :
          navigation.navigate('Verification');
      } else {
        navigation.navigate('Auth');
      }
      */
      if (isAuthenticated) {
        navigation.navigate('App');
      } else {
        navigation.navigate('Auth');
      }
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <Container style={styles.container}>
        <View style={styles.logoContainer}>
          <Logo color="white" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>For Business</Text>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: sessionSelectors.isAuthenticated(state),
  businessItem: businessSelectors.businessItem(state),
});

const mapDispatchToProps = dispatch => ({
  bootstrap: () => dispatch(sessionActions.bootstrap()),
  requestCameraPermission: () => dispatch(sessionActions.requestCameraPermission()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);
