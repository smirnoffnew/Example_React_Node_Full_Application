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
      newBrandName: this.props.newBusiness.brandName,
    });
  }

  state = {
    brandNameEditing: false,
  }

  _onEditPressHandler = () => {
    this.setState(prevState => ({ brandNameEditing: !prevState.brandNameEditing }));
  }

  _onSubmit = () => {
    this.props.updateBrandName();
  }

  render() {
    const { handleSubmit, dispatch, newBusiness } = this.props;
    const { brandNameEditing } = this.state;

    return (
      <Fragment>
        <ListClause
          onPress={this._onEditPressHandler}
          content="Brand name"
          editing={brandNameEditing}
        />
        {
          brandNameEditing ?
            <View style={styles.dropDownAnimationContainer}>
              <Animatable.View
                animation="fadeInDownBig"
                duration={300}
                style={styles.inputContainer}
              >
                <Field
                  name="newBrandName"
                  defaultValue={newBusiness.brandName}
                  component={Input}
                  autoCorrect={false}
                  onSubmitEditing={handleSubmit(this._onSubmit)}
                  returnKeyType="next"
                  onEraseText={() => reduxFormClear('newBrandName', { newBrandName: '' }, dispatch)}
                  validate={usernameValidation}
                />
                <ButtonRounded
                  theme="primary"
                  square
                  onPress={handleSubmit(this._onSubmit)}
                >
                  Update brand name
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
});

const mapDispatchToProps = dispatch => ({
  updateBrandName: () => dispatch(editProfileActions.updateBrandName()),
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({ form: 'newBrandName' })(FormNameUpdate)
);
