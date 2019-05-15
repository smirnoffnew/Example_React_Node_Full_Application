import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { View } from 'native-base';
import ListClause from '@/components/UI/ListClause';
import Input from '@/components/Input';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import { signinPasswordValidation } from '@/services/helpers/inputDataValidation';
import { actions as editProfileActions } from '@/reducers/editProfile';

class FormUserDelete extends Component {

  state = {
    deletePressed: false,
  }

  _onDeletePressHandler = () => {
    this.setState(prevState => ({ deletePressed: !prevState.deletePressed }));
  }

  _onSubmit = () => {
    this.props.deleteUser();
  }

  render() {
    const { handleSubmit } = this.props;
    const { deletePressed } = this.state;

    return (
      <Fragment>
        <ListClause
          onPress={this._onDeletePressHandler}
          content="Delete account"
          primary
          editing={deletePressed}
        />
        {
          deletePressed ?
            <View style={styles.dropDownAnimationContainer}>
              <Animatable.View
                animation="fadeInDownBig"
                duration={300}
                style={styles.inputContainer}
              >
                <Field
                  label="Enter your password"
                  name="password"
                  component={Input}
                  secure
                  autoCorrect={false}
                  onSubmitEditing={handleSubmit(this._onSubmit)}
                  returnKeyType="next"
                  validate={signinPasswordValidation}
                />
                <ButtonRounded
                  theme="primary"
                  square
                  onPress={handleSubmit(this._onSubmit)}
                >
                  Delete account
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
  deleteUser: () => dispatch(editProfileActions.deleteUser()),
});

export default connect(
  null, mapDispatchToProps
)(
  reduxForm({ form: 'deleteUser' })(FormUserDelete)
);
