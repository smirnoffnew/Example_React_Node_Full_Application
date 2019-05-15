import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import { Container, View } from 'native-base';
import AuthHeader from '@/components/AuthHeader';
import ContentScroll from '@/components/UI/ContentScroll';
import Input from '@/components/Input';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import reduxFormClear from '@/services/helpers/reduxFormClear';
import { emailValidation } from '@/services/helpers/inputDataValidation';

class RegisterEmail extends Component {
  static navigationOptions = {
    header: <AuthHeader screenTitle="Create account" />,
  }

  _onSubmit = () => {
    this.props.navigation.navigate('RegisterPassword');
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
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={handleSubmit(this._onSubmit)}
              autoFocus
              onEraseText={() => reduxFormClear('signup', { email: '' }, this.props.dispatch)}
              validate={emailValidation}
            />
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

export default reduxForm({ form: 'signup', destroyOnUnmount: false })(RegisterEmail);
