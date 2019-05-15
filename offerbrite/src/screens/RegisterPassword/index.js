import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import { Container, View } from 'native-base';
import AuthHeader from '@/components/AuthHeader';
import ContentScroll from '@/components/UI/ContentScroll';
import Input from '@/components/Input';
import TextContent from '@/components/TextContent';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import { passwordValidation } from '@/services/helpers/inputDataValidation';

class RegisterPassword extends Component {
  static navigationOptions = {
    header: <AuthHeader screenTitle="Password" />,
  }

  state = {
    passwordDoesNotMatch: false,
  }

  _onSubmit = values => {
    if (values.password !== values.repeatPassword) {
      this.setState({ passwordDoesNotMatch: true });
    } else {
      this.setState({ passwordDoesNotMatch: false });
      this.props.navigation.navigate('RegisterName');
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <Container>
        <ContentScroll style={styles.content}>
          <View style={styles.inputContainer}>
            <Field
              label="Password"
              name="password"
              component={Input}
              autoFocus
              returnKeyType="done"
              autoCorrect={false}
              secure
              validate={passwordValidation}
            />
            <Field
              label="Repeat password"
              name="repeatPassword"
              component={Input}
              returnKeyType="next"
              autoCorrect={false}
              onSubmitEditing={handleSubmit(this._onSubmit)}
              secure
            />
            {
              this.state.passwordDoesNotMatch ?
                <TextContent type="subtext" color="danger">Password doesn't match</TextContent> :
                null
            }
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

export default reduxForm({ form: 'signup', destroyOnUnmount: false })(RegisterPassword);
