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

class RegisterBrandName extends Component {
  static navigationOptions = {
    header: <AuthHeader screenTitle="Brand name" />,
  }

  _onSubmit = () => {
    this.props.navigation.navigate('RegisterAddress');
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <Container>
        <ContentScroll style={styles.content}>
          <View style={styles.inputContainer}>
            <Field
              label="Your brand name"
              name="brandname"
              component={Input}
              autoFocus
              autoCorrect={false}
              returnKeyType="next"
              onEraseText={() => reduxFormClear('business', { brandname: '' }, this.props.dispatch)}
              validate={usernameValidation}
              onSubmitEditing={handleSubmit(this._onSubmit)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <ButtonRounded
              onPress={handleSubmit(this._onSubmit)}
              theme="primary"
            >
              Continue
            </ButtonRounded>
          </View>
        </ContentScroll>
      </Container>
    );
  }
}

export default reduxForm({ form: 'business', destroyOnUnmount: false })(RegisterBrandName);
