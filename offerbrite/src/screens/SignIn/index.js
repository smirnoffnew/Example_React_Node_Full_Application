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
import { emailValidation, passwordValidation } from '@/services/helpers/inputDataValidation';
import { actions as sessionActions, selectors as sessionSelectors } from '@/reducers/session';

class SignIn extends Component {
  static navigationOptions = {
    header: null,
  }

  componentDidUpdate(prevProps) {
    if (this.props.user && !prevProps.user) {
      this.props.navigation.navigate('App');
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
            <Logo color="red" />
          </View>
          <Field
            label="Email Address"
            name="email"
            autoCorrect={false}
            component={Input}
            autoCapitalize="none"
            returnKeyType="done"
            onEraseText={() => reduxFormClear('signin', { email: '' }, this.props.dispatch)}
            validate={emailValidation}
          />
          <Field
            label="Password"
            name="password"
            component={Input}
            autoCorrect={false}
            secure
            returnKeyType="next"
            onSubmitEditing={handleSubmit(this._onSubmit)}
            validate={passwordValidation}
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
              theme="danger"
            >
              Sign In
            </ButtonRounded>
          </View>
          <TextContent
            type="subtext"
            color="default"
            style={styles.bottomTextContainer}
          >
            Not a member yet?
          </TextContent>
          <ButtonTransparent
            position="center"
            onPress={() => navigation.navigate('RegisterEmail')}
            danger
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
  user: sessionSelectors.user(state),
});

const mapDispatchToProps = dispatch => ({
  signin: () => dispatch(sessionActions.signin()),
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({ form: 'signin' })(SignIn)
);
