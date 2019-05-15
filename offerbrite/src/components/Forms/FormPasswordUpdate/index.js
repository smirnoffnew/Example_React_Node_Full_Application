import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { View } from 'native-base';
import ListClause from '@/components/UI/ListClause';
import Input from '@/components/Input';
import TextContent from '@/components/TextContent';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import { passwordValidation } from '@/services/helpers/inputDataValidation';
import { actions as editProfileActions } from '@/reducers/editProfile';

class FormPasswordUpdate extends Component {

  state = {
    passwordEditing: false,
    passwordDoesNotMatch: false,
  }

  _onEditPressHandler = () => {
    this.setState(prevState => ({ passwordEditing: !prevState.passwordEditing }));
  }

  _onSubmit = values => {
    if (values.newPassword !== values.repeatedNewPassword) {
      this.setState({ passwordDoesNotMatch: true });
    } else {
      this.setState({ passwordDoesNotMatch: false });
      this.props.updatePassword();
    }
  }

  render() {
    const { handleSubmit } = this.props;
    const { passwordEditing, passwordDoesNotMatch } = this.state;

    return (
      <Fragment>
        <ListClause
          onPress={() => this._onEditPressHandler('password')}
          content="Password"
          editing={passwordEditing}
        />
        {
          passwordEditing ?
            <View style={styles.dropDownAnimationContainer}>
              <Animatable.View
                animation="fadeInDownBig"
                duration={300}
                style={styles.inputContainer}
              >
                <Field
                  label="Old password"
                  name="password"
                  secure
                  component={Input}
                  autoCorrect={false}
                  returnKeyType="done"
                  validate={passwordValidation}
                />
                <Field
                  label="New password"
                  name="newPassword"
                  secure
                  component={Input}
                  autoCorrect={false}
                  returnKeyType="done"
                  validate={passwordValidation}
                />
                <Field
                  label="Repeat new password"
                  name="repeatedNewPassword"
                  component={Input}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={handleSubmit(this._onSubmit)}
                  secure
                />
                {
                  passwordDoesNotMatch ?
                    <TextContent type="subtext" color="danger">Password doesn't match</TextContent> :
                    null
                }
                <ButtonRounded
                  theme="danger"
                  square
                  onPress={handleSubmit(this._onSubmit)}
                >
                  Update password
                </ButtonRounded>
              </Animatable.View>
            </View> :
            null
        }
      </Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  updatePassword: () => dispatch(editProfileActions.updatePassword()),
});

export default connect(
  null, mapDispatchToProps
)(
  reduxForm({ form: 'newPassword' })(FormPasswordUpdate)
);
