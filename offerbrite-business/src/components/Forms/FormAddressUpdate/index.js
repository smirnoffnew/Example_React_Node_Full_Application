import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';
import { View } from 'native-base';
import ListClause from '@/components/UI/ListClause';
import TextContent from '@/components/TextContent';
import AddressField from '@/components/AddressField/Select';
import ButtonRounded from '@/components/UI/ButtonRounded';
import styles from './styles';

import { actions as editProfileActions, selectors as editProfileSelectors } from '@/reducers/editProfile';

class FormAddressUpdate extends Component {

  state = {
    addressEditing: false,
  }

  _onEditPressHandler = () => {
    this.setState(prevState => ({ addressEditing: !prevState.addressEditing }));
  }

  _onSubmit = () => {
    this.props.updateAddress();
  }


  render() {
    const { newLocation, editNewAddress, newAddressWithoutZIP, setNewAddress, eraseAddress } = this.props;
    const { addressEditing } = this.state;

    return (
      <Fragment>
        <ListClause
          onPress={this._onEditPressHandler}
          content="Address"
          editing={addressEditing}
        />
        {
          addressEditing ?
            <View style={styles.dropDownAnimationContainer}>
              <Animatable.View
                animation="fadeInDownBig"
                duration={300}
                style={styles.inputContainer}
              >
                <View style={styles.inputContainer}>
                  <AddressField
                    label="Address"
                    editAddress={editNewAddress}
                    storeAddress={newAddressWithoutZIP}
                    setAddress={setNewAddress}
                    eraseAddress={eraseAddress}
                  />
                  <TextContent type="subtext">
                    Start typing and choose one from results.
                  </TextContent>
                </View>
                <View style={styles.buttonContainer}>
                  <ButtonRounded
                    onPress={this._onSubmit}
                    square
                    theme={!newLocation.position ? 'disabled' : 'primary'}
                  >
                    Update address
                  </ButtonRounded>
                </View>
              </Animatable.View>
            </View> :
            null
        }
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  newAddressWithoutZIP: editProfileSelectors.newAddressWithoutZIP(state),
  newLocation: editProfileSelectors.newLocation(state),
});

const mapDispatchToProps = dispatch => ({
  updateAddress: () => dispatch(editProfileActions.updateAddress()),
  setNewAddress: location => dispatch(editProfileActions.setNewAddress(location)),
  editNewAddress: text => dispatch(editProfileActions.editNewAddress(text)),
  eraseAddress: () => dispatch(editProfileActions.eraseAddress()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormAddressUpdate);
