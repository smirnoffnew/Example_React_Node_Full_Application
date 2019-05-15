import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Container, View } from 'native-base';
import ContentScroll from '@/components/UI/ContentScroll';
import AuthHeader from '@/components/AuthHeader';
import TextContent from '@/components/TextContent';
import AddressField from '@/components/AddressField/Select';
import ButtonRounded from '@/components/UI/ButtonRounded';
import ButtonTransparent from '@/components/UI/ButtonTransparent';
import styles from './styles';

import { actions as businessActions, selectors as businessSelectors } from '@/reducers/business';

class RegisterAddress extends Component {
  static navigationOptions = {
    header: <AuthHeader screenTitle="Store address" />
  }

  _onSubmit = () => {
    this.props.navigation.navigate('RegisterContacts');
  }

  render() {
    const { location, editAddress, addressWithoutZIP, setAddress, eraseAddress } = this.props;

    return (
      <Container>
        <ContentScroll style={styles.content}>
          <View style={styles.inputContainer}>
            <AddressField
              label="Store address"
              editAddress={editAddress}
              storeAddress={addressWithoutZIP}
              setAddress={setAddress}
              eraseAddress={eraseAddress}
            />
            <TextContent type="subtext">
              Start typing and choose one from results.
            </TextContent>
          </View>
          <View style={styles.buttonContainer}>
            <View style={{ marginVertical: 10 }} />
            <ButtonRounded
              onPress={this._onSubmit}
              theme={!location.position ? 'disabled' : 'primary'}
            >
              Continue
            </ButtonRounded>
          </View>
        </ContentScroll>
      </Container>
    );
  }
}

RegisterAddress.propTypes = {
  addressWithoutZIP: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  editAddress: PropTypes.func.isRequired,
  eraseAddress: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  addressWithoutZIP: businessSelectors.addressWithoutZIP(state),
  location: businessSelectors.location(state),
});

const mapDispatchToProps = dispatch => ({
  setAddress: location => dispatch(businessActions.setAddress(location)),
  editAddress: text => dispatch(businessActions.editAddress(text)),
  eraseAddress: () => dispatch(businessActions.eraseAddress()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterAddress);
