import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { Container, View } from 'native-base';
import ContentScroll from '@/components/UI/ContentScroll';
import Logo from '@/components/UI/Logo';
import Input from '@/components/Input';
import TextContent from '@/components/TextContent';
import ButtonTransparent from '@/components/UI/ButtonTransparent';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import reduxFormClear from '@/services/helpers/reduxFormClear';
import { emailValidation, signinPasswordValidation } from '@/services/helpers/inputDataValidation';
import { actions as sessionActions, selectors as sessionSelectors } from '@/reducers/session';
import { selectors as businessSelectors } from '@/reducers/business';

class SignIn extends Component {
  static navigationOptions = {
    header: null,
  }

  componentDidUpdate(prevProps) {
    const { businessItem, navigation, isAuthenticated } = this.props;

    // TEMP: verification turned off
    /*
    if (businessItem && isAuthenticated) {
      businessItem.isVerified ?
        navigation.navigate('App') :
        navigation.navigate('Verification');
    }
    */

    if (businessItem && isAuthenticated) {
        navigation.navigate('App');
    }
  }

  _onSubmit = () => {
    this.props.signin();
  }

  render() {
    const { handleSubmit, navigation } = this.props;

    return (
      <Container>
        <ContentScroll style={styles.content}>
          <View style={styles.logoContainer}>
            <Logo color="blue" />
          </View>
          <Field
            label="Email Address"
            name="email"
            component={Input}
            autoCapitalize="none"
            autoCorrect={false}
            onEraseText={() => reduxFormClear('signin', { email: '' }, this.props.dispatch)}
            validate={emailValidation}
          />
          <Field
            label="Password"
            name="password"
            component={Input}
            secure
            returnKeyType="next"
            autoCorrect={false}
            validate={signinPasswordValidation}
            onSubmitEditing={handleSubmit(this._onSubmit)}
          />
          <ButtonTransparent
            position="right"
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Forgot password
          </ButtonTransparent>
          <View style={styles.buttonContainer}>
            <ButtonRounded
              onPress={handleSubmit(this._onSubmit)}
              theme="primary"
            >
              Sign In
            </ButtonRounded>
          </View>
          <TextContent
            type="subtext"
            style={styles.bottomTextContainer}
          >
            Not a member yet?
          </TextContent>
          <ButtonTransparent
            position="center"
            onPress={() => navigation.navigate('RegisterEmail')}
            primary
          >
            Create account
          </ButtonTransparent>
          <View style={styles.bottomSpace} />
        </ContentScroll>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: sessionSelectors.isAuthenticated(state),
  businessItem: businessSelectors.businessItem(state),
});

const mapDispatchToProps = dispatch => ({
  signin: () => dispatch(sessionActions.signin()),
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({ form: 'signin' })(SignIn)
);
