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
import { usernameValidation } from '@/services/helpers/inputDataValidation';
import { actions as editProfileActions, selectors as editProfileSelectors } from '@/reducers/editProfile';

class FormNameUpdate extends Component {

  constructor(props) {
    super(props);
    this.props.initialize({
      newUsername: this.props.newUsername,
    });
  }

  state = {
    nameEditing: false,
  }

  _onEditPressHandler = () => {
    this.setState(prevState => ({ nameEditing: !prevState.nameEditing }));
  }

  _onSubmit = () => {
    this.props.updateUser();
  }

  render() {
    const { handleSubmit, dispatch, newUsername } = this.props;
    const { nameEditing } = this.state;

    return (
      <Fragment>
        <ListClause
          onPress={this._onEditPressHandler}
          content="Name"
          editing={nameEditing}
        />
        {
          nameEditing ?
            <View style={styles.dropDownAnimationContainer}>
              <Animatable.View
                animation="fadeInDownBig"
                duration={300}
                style={styles.inputContainer}
              >
                <Field
                  name="newUsername"
                  defaultValue={newUsername}
                  component={Input}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={handleSubmit(this._onSubmit)}
                  onEraseText={() => reduxFormClear('newUsername', { newUsername: '' }, dispatch)}
                  validate={usernameValidation}
                />
                <ButtonRounded
                  theme="danger"
                  square
                  onPress={handleSubmit(this._onSubmit)}
                >
                  Update name
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
  newUsername: editProfileSelectors.newUsername(state),
});

const mapDispatchToProps = dispatch => ({
  updateUser: () => dispatch(editProfileActions.updateUser()),
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({ form: 'newUsername' })(FormNameUpdate)
);
