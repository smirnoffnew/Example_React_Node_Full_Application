import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import { Container, View } from 'native-base';
import AuthHeader from '@/components/AuthHeader';
import ContentScroll from '@/components/UI/ContentScroll';
import Input from '@/components/Input';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import reduxFormClear from '@/services/helpers/reduxFormClear';
import { usernameValidation } from '@/services/helpers/inputDataValidation';

class RegisterName extends Component {
  static navigationOptions = {
    header: <AuthHeader screenTitle="Name" />,
  }

  _onSubmit = () => {
    this.props.navigation.navigate('TermsOfUse');
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <Container>
        <ContentScroll style={styles.content}>
          <View style={styles.inputContainer}>
            <Field
              label="Your name"
              name="username"
              component={Input}
              returnKeyType="next"
              onSubmitEditing={handleSubmit(this._onSubmit)}
              autoFocus
              autoCorrect={false}
              onEraseText={() => reduxFormClear('signup', { username: '' }, this.props.dispatch)}
              validate={usernameValidation}
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

export default reduxForm({ form: 'signup', destroyOnUnmount: false })(RegisterName);
