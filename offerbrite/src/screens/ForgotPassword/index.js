import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { Container, View } from 'native-base';
import AuthHeader from '@/components/AuthHeader';
import ContentScroll from '@/components/UI/ContentScroll';
import Input from '@/components/Input';
import TextContent from '@/components/TextContent';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import reduxFormClear from '@/services/helpers/reduxFormClear';
import { emailValidation } from '@/services/helpers/inputDataValidation';
import { actions as sessionActions } from '@/reducers/session';
import withNotification from '@/hoc/withNotification';

class ForgotPassword extends Component {
  static navigationOptions = {
    header: <AuthHeader screenTitle="Forgot password" />,
  }

  _onSubmit = () => {
    this.props.resetPassword()
      .then(response => {
        if (response.data.status === 'OK') {
          this.props.navigation.navigate('ActionSuccess', {
            fromRoute: this.props.navigation.state.routeName,
          });
        }
      })
      .catch(error => {
        this.props.requestFail(error);
      });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <Container>
        <ContentScroll style={styles.content}>
          <View style={styles.inputContainer}>
            <Field
              label="Email Address"
              name="email"
              component={Input}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={handleSubmit(this._onSubmit)}
              onEraseText={() => reduxFormClear('forgotPassword', { email: '' }, this.props.dispatch)}
              validate={emailValidation}
            />
            <TextContent type="subtext" color="default">We will send you a link to restore your account</TextContent>
          </View>
          <View style={styles.buttonContainer}>
            <ButtonRounded
              onPress={handleSubmit(this._onSubmit)}
              theme="danger"
            >
              Continue
            </ButtonRounded>
          </View>
        </ContentScroll>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  resetPassword: () => dispatch(sessionActions.resetPassword()),
});

export default connect(
  null, mapDispatchToProps
)(
  reduxForm({ form: 'forgotPassword' })(withNotification(ForgotPassword))
);
