import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container, View, } from 'native-base';
import ContentScroll from '@/components/UI/ContentScroll';
import AuthHeader from '@/components/AuthHeader';
import ImageContainer from '@/components/ImageContainer';
import TextContent from '@/components/TextContent';
import ButtonRounded from '@/components/UI/ButtonRounded';
import ButtonTransparent from '@/components/UI/ButtonTransparent';
import styles from './styles';

import { actions as businessActions, selectors as businessSelectors } from '@/reducers/business';
import { actions as sessionActions, selectors as sessionSelectors } from '@/reducers/session';

class RegisterLogo extends Component {
  static navigationOptions = {
    header: <AuthHeader screenTitle="Logo" />
  }

  componentDidUpdate(prevProps) {
    if (this.props.businessItem && this.props.isAuthenticated) {
      // TEMP: varification turned off
      // this.props.navigation.navigate('Verification');
      this.props.navigation.navigate('App');
    }
  }

  render() {
    const { logo, setLogo, signup } = this.props;

    return (
      <Container>
        <ContentScroll style={styles.content}>
          <View style={styles.imageContainer}>
            <ImageContainer
              editable
              circle
              imageUrl={logo.imageUrl}
              onPress={setLogo}
            />
            <TextContent
              style={styles.textContainer}
              type="subtext"
            >
              Add your сompany logo
            </TextContent>
          </View>
          <View style={styles.buttonContainer}>
            <ButtonTransparent
              position="center"
              onPress={signup}
              primary
            >
              Skip
            </ButtonTransparent>
            <View style={{ marginVertical: 10 }} />
            <ButtonRounded
              onPress={signup}
              theme="primary"
            >
              Continue
            </ButtonRounded>
          </View>
        </ContentScroll>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  logo: businessSelectors.logo(state),
  businessItem: businessSelectors.businessItem(state),
  isAuthenticated: sessionSelectors.isAuthenticated(state),
});

const mapDispatchToProps = dispatch => ({
  signup: () => dispatch(sessionActions.signup()),
  setLogo: () => dispatch(businessActions.setLogo()),
  registerBusiness: () => dispatch(businessActions.registerBusiness()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterLogo);
