import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { View } from 'native-base';
import ListClause from '@/components/UI/ListClause';
import Input from '@/components/Input';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import reduxFormClear from '@/services/helpers/reduxFormClear';
import { emailValidation, signinPasswordValidation } from '@/services/helpers/inputDataValidation';
import { actions as editProfileActions, selectors as editProfileSelectors } from '@/reducers/editProfile';

class FormEmailUpdate extends Component {

  constructor(props) {
    super(props);
    this.props.initialize({
      newEmail: this.props.newEmail,
      confirmationPassword: '',
    });
  }

  state = {
    emailEditing: false,
  }

  _onEditPressHandler = () => {
    this.setState(prevState => ({ emailEditing: !prevState.emailEditing }));
  }

  _onSubmit = () => {
    this.props.updateEmail();
  }

  render() {
    const { handleSubmit, dispatch, newEmail } = this.props;
    const { emailEditing } = this.state;

    return (
      <Fragment>
        <ListClause
          onPress={this._onEditPressHandler}
          content="Email"
          editing={emailEditing}
        />
        {
          emailEditing ?
            <View style={styles.dropDownAnimationContainer}>
              <Animatable.View
                animation="fadeInDownBig"
                duration={300}
                style={styles.inputContainer}
              >
                <Field
                  label="Enter your new email address"
                  name="newEmail"
                  defaultValue={newEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  component={Input}
                  onEraseText={() => reduxFormClear('newEmail', { newEmail: '' }, dispatch)}
                  validate={emailValidation}
                />
                <Field
                  label="Enter your password"
                  name="confirmationPassword"
                  secure
                  autoCorrect={false}
                  onSubmitEditing={handleSubmit(this._onSubmit)}
                  returnKeyType="next"
                  component={Input}
                  validate={signinPasswordValidation}
                />
                <ButtonRounded
                  theme="primary"
                  square
                  onPress={handleSubmit(this._onSubmit)}
                >
                  Update email
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
  newEmail: editProfileSelectors.newEmail(state),
});

const mapDispatchToProps = dispatch => ({
  updateEmail: () => dispatch(editProfileActions.updateEmail()),
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({ form: 'newEmail' })(FormEmailUpdate)
);
