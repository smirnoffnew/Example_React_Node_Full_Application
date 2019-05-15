import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { Container, View } from 'native-base';
import ContentScroll from '@/components/UI/ContentScroll';
import AuthHeader from '@/components/AuthHeader';
import TextContent from '@/components/TextContent';
import PhoneField from '@/components/PhoneField';
import Input from '@/components/Input';
import ButtonRounded from '@/components/UI/ButtonRounded';
import ButtonTransparent from '@/components/UI/ButtonTransparent';
import styles from './styles';

import reduxFormClear from '@/services/helpers/reduxFormClear';
import { urlValidation, mobileNumberValidation } from '@/services/helpers/inputDataValidation';
import { actions as businessActions, selectors as businessSelectors } from '@/reducers/business';

class RegisterContacts extends Component {
  static navigationOptions = {
    header: <AuthHeader screenTitle="Contact information" />
  }

  _onSubmit = () => {
    this.props.navigation.navigate('RegisterLogo');
  }

  render() {
    const { handleSubmit, ISOcode, callingCode, changeCallingCode, navigation } = this.props;

    return (
      <Container>
        <ContentScroll style={styles.content}>
          <View style={styles.inputContainer}>
            <Field
              label="Web site"
              name="website"
              autoCorrect={false}
              autoCapitalize="none"
              component={Input}
              onEraseText={() => reduxFormClear('business', { website: '' }, this.props.dispatch)}
              validate={urlValidation}
            />
            <View style={{ marginVertical: 10 }} />
            <Field
              label="Phone number"
              name="mobileNumber"
              component={PhoneField}
              keyboardType="numeric"
              autoCorrect={false}
              onEraseText={() => reduxFormClear('business', { mobileNumber: '' }, this.props.dispatch)}
              ISOcode={ISOcode}
              callingCode={callingCode}
              onChangeCallingCode={changeCallingCode}
              validate={mobileNumberValidation}
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

const mapStateToProps = state => ({
  ISOcode: businessSelectors.ISOcode(state),
  callingCode: businessSelectors.callingCode(state),
});

const mapDispatchToProps = dispatch => ({
  changeCallingCode: values => dispatch(businessActions.changeCallingCode(values)),
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({ form: 'business', destroyOnUnmount: false })(RegisterContacts)
);
