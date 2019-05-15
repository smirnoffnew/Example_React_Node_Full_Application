import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container, Content, List, View } from 'native-base';
import AppHeader from '@/components/AppHeader';
import ImageContainer from '@/components/ImageContainer';
import FormNameUpdate from '@/components/Forms/FormNameUpdate';
import FormEmailUpdate from '@/components/Forms/FormEmailUpdate';
import FormPasswordUpdate from '@/components/Forms/FormPasswordUpdate';
import FormAddressUpdate from '@/components/Forms/FormAddressUpdate';
import FormContactsUpdate from '@/components/Forms/FormContactsUpdate';
import FormUserDelete from '@/components/Forms/FormUserDelete';
import NotificationUpdate from '@/components/Forms/NotificationUpdate';
import ListClauseSeparator from '@/components/UI/ListClauseSeparator';
import ContainerCenter from '@/components/UI/ContainerCenter';
import ListClause from '@/components/UI/ListClause';

import { actions as sessionActions, selectors as sessionSelectors } from '@/reducers/session';
import { actions as editProfileActions, selectors as editProfileSelectors } from '@/reducers/editProfile';
import { selectors as businessSelectors } from '@/reducers/business';
import styles from './styles';

class EditProfile extends Component {
  static navigationOptions = {
    header: <AppHeader screenTitle="Edit profile" type="withBackButton" />,
  }

  componentDidUpdate(prevProps) {
    if (prevProps && !this.props.user) {
      this.props.navigation.navigate('SignIn');
    }
  }

  _handleLogout = () => {
    this.props.navigation.navigate('AuthLoading');
    this.props.logout();
  }

  render() {
    const { businessItem, setNewLogo } = this.props;

    return (
      <Container style={styles.container}>
        <Content>
          <View style={styles.logoContainer}>
            <ImageContainer
              circle
              imageUrl={businessItem.logoUrl || ''}
              editable
              onPress={setNewLogo}
            />
          </View>
          <View style={styles.content}>
            <ContainerCenter style={{ backgroundColor: '#fff' }}>
              <List>
                <FormNameUpdate />
                <FormEmailUpdate />
                <FormPasswordUpdate />
                <FormAddressUpdate />
                <FormContactsUpdate />
                <ListClause
                  onPress={() => alert('Soon...')}
                  content="Privacy policy"
                />
                <ListClause
                  onPress={() => alert('Soon...')}
                  content="Acknowlagments"
                />
                <NotificationUpdate />
                <ListClauseSeparator />
                <ListClause
                  onPress={this._handleLogout}
                  content="Log out"
                  primary
                />
                <ListClauseSeparator />
                <FormUserDelete />
              </List>
            </ContainerCenter>
          </View>
        </Content>
      </Container>
    );
  }
}

EditProfile.defaultProps = {
  businessItem: {
    logoUrl: '',
    brandName: ' ',
    websiteUrl: '',
    mobileNumbers: [{ cc: 1, number: 1111111111 }],
    isVerified: false,
  },
};

const mapStateToProps = state => ({
  user: sessionSelectors.user(state),
  businessItem: businessSelectors.businessItem(state),
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(sessionActions.logout()),
  setNewLogo: () => dispatch(editProfileActions.setNewLogo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
