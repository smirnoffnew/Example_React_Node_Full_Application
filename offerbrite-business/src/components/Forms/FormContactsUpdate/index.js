import React, { PureComponent, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { View } from 'native-base';
import ListClause from '@/components/UI/ListClause';
import Input from '@/components/Input';
import PhoneField from '@/components/PhoneField';
import ButtonRounded from '@/components/UI/ButtonRounded';
import ButtonTransparent from '@/components/UI/ButtonTransparent';
import styles from './styles';

import reduxFormClear from '@/services/helpers/reduxFormClear';
import { urlValidation, mobileNumberValidation } from '@/services/helpers/inputDataValidation';
import { actions as editProfileActions, selectors as editProfileSelectors } from '@/reducers/editProfile';

class FormContactsUpdate extends PureComponent {

  constructor(props) {
    super(props);
    this.initialForm = {
      website: this.props.newBusiness.websiteUrl,
    };

    this.props.mobileNumbers.forEach((mobileNumber, index) => {
      this.initialForm[`mobileNumber_${index}`] = mobileNumber.number;
    });
    console.log(this.initialForm);
    this.props.initialize({...this.initialForm});
  }

  state = {
    contactsEditing: false,
  }

  _onEditPressHandler = () => {
    this.setState(prevState => ({ contactsEditing: !prevState.contactsEditing }));
  }

  _onSubmit = () => {
    this.props.updateContacts();
  }

  render() {
    const {
      handleSubmit,
      dispatch,
      newBusiness,
      mobileNumbers,
      changeMobileCode,
      removePhoneField,
      addPhoneField,
      onChangeControl } = this.props;
    const { contactsEditing } = this.state;

    return (
      <Fragment>
        <ListClause
          onPress={this._onEditPressHandler}
          content="Contact information"
          editing={contactsEditing}
        />
        {
          contactsEditing ?
            <View style={styles.dropDownAnimationContainer}>
              <Animatable.View
                animation="fadeInDownBig"
                duration={300}
                style={styles.inputContainer}
              >
                <Field
                  label="Web site"
                  name="website"
                  autoCapitalize="none"
                  defaultValue={newBusiness.websiteUrl}
                  autoCorrect={false}
                  component={Input}
                  onEraseText={() => reduxFormClear('newContacts', { website: '' }, dispatch)}
                  validate={urlValidation}
                />
                {
                  mobileNumbers.map((mobileNumber, index) => (
                    <Field
                      key={index}
                      id={index}
                      label={index === 0 ? 'Phone number' : ' '}
                      name={`mobileNumber_${index}`}
                      component={PhoneField}
                      keyboardType="numeric"
                      defaultValue={mobileNumber.number}
                      onEraseText={() => reduxFormClear('newContacts', { [`mobileNumber_${index}`]: '' }, dispatch)}
                      onRemove={
                        index === 0 ?
                          null :
                          () => removePhoneField(index)
                      }
                      ISOcode={mobileNumber.ISOcode}
                      callingCode={mobileNumber.callingCode}
                      onChangeCallingCode={values => changeMobileCode(values, index)}
                      onChangeControl={onChangeControl}
                      validate={mobileNumberValidation}
                    />
                  ))
                }
                {
                  mobileNumbers.length < 5 ?
                    <ButtonTransparent
                      onPress={addPhoneField}
                      position="right"
                    >
                      + Add more numbers
                    </ButtonTransparent> :
                    null
                }
                <View style={{ marginVertical: 10 }} />
                <ButtonRounded
                  theme={!mobileNumbers[0].number ? 'disabled' : 'primary'}
                  square
                  onPress={handleSubmit(this._onSubmit)}
                >
                  Update contacts
                </ButtonRounded>
              </Animatable.View>
            </View> :
            null
        }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  newBusiness: editProfileSelectors.newBusiness(state),
  mobileNumbers: editProfileSelectors.mobileNumbers(state),
});

const mapDispatchToProps = dispatch => ({
  updateContacts: () => dispatch(editProfileActions.updateContacts()),
  changeMobileCode: (values, index) => dispatch(editProfileActions.changeMobileCode(values, index)),
  addPhoneField: () => dispatch(editProfileActions.addPhoneField()),
  removePhoneField: index => dispatch(editProfileActions.removePhoneField(index)),
  onChangeControl: (text, index) => dispatch(editProfileActions.onChangeControl(text, index)),
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({ form: 'newContacts' })(FormContactsUpdate)
);
