import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Container, Content, List, View } from 'native-base';
import AppHeader from '@/components/AppHeader';
import ImageContainer from '@/components/ImageContainer';
import ListClause from '@/components/UI/ListClause';
import ListClauseSeparator from '@/components/UI/ListClauseSeparator';
import ButtonSquare from '@/components/UI/ButtonSquare';
import ContainerCenter from '@/components/UI/ContainerCenter';
import styles from './styles';

import { actions as businessActions, selectors as businessSelectors } from '@/reducers/business';
import { actions as editProfileActions } from '@/reducers/editProfile';
import { GA_trackScreen } from '@/services/analytics';

class Profile extends Component {
  static navigationOptions = {
    header: (
      <AppHeader
        screenTitle="Profile"
        type="withBackButton"
        goBackRoute="Offers"
      />
    )
  }

  componentDidMount() {
    GA_trackScreen('Profile');
  }

  _onEditPressHandler = () => {
    this.props.setInitialBusinessForUpdate();
    this.props.navigation.navigate('EditProfile');
  }

  render() {
    const { navigation, logout, user, businessItem, addresses } = this.props;

    let phoneNumbers;
    if (businessItem.hasOwnProperty('mobileNumbers')) {
      phoneNumbers = businessItem.mobileNumbers.map(mobileNumber => (
        `+${mobileNumber.cc}${mobileNumber.number}`
      )).join('\n');
    }

    return (
      <Container style={styles.container}>
        <Content>
          <View style={styles.logoContainer}>
            <ImageContainer
              circle
              imageUrl={businessItem.logoUrl || ''}
            />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <ContainerCenter>
              <List>
                <ListClauseSeparator>Information</ListClauseSeparator>
                <ListClause
                  disabled
                  title="Brand name:"
                  content={businessItem.brandName}
                />
                {
                  addresses.map((address, index) => (
                    <ListClause
                      key={index}
                      disabled
                      title="Address:"
                      content={address}
                    />
                  ))
                }
                <ListClauseSeparator>Contacts</ListClauseSeparator>
                {
                  businessItem.websiteUrl ?
                    <ListClause
                      disabled
                      title="Website:"
                      content={businessItem.websiteUrl}
                    /> :
                    null
                }
                {
                  phoneNumbers ?
                    <ListClause
                      disabled
                      title={phoneNumbers.length > 1 ? 'Phone numbers:' : 'Phone number:'}
                      content={phoneNumbers}
                    /> :
                    null
                }
              </List>
              <View style={styles.buttonsContainer}>
            <ButtonSquare
              primary
              onPress={this._onEditPressHandler}
            >
              Edit profile
            </ButtonSquare>
            {
              // TEMP: verification turned off
              // !businessItem.isVerified ?
              //   <Fragment>
              //     <View style={{ marginVertical: 10 }} />
              //     <ButtonSquare
              //       light
              //       onPress={() => this.props.navigation.navigate('VerifyAccount')}
              //     >
              //       Verify account
              //     </ButtonSquare>
              //   </Fragment> :
              //   null
            }
          </View>
            </ContainerCenter>
          </View>
        </Content>
      </Container>
    );
  }
}

Profile.defaultProps = {
  businessItem: {
    logoUrl: '',
    brandName: ' ',
    websiteUrl: '',
    mobileNumbers: [{ cc: 1, number: 1111111111 }],
    isVerified: false,
  },
};

const mapStateToProps = state => ({
  businessItem: businessSelectors.businessItem(state),
  addresses: businessSelectors.addresses(state),
});

const mapDispatchToProps = dispatch => ({
  setInitialBusinessForUpdate: () => dispatch(editProfileActions.setInitialBusinessForUpdate()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
