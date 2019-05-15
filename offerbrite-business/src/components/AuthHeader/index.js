import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import { Header, Left, Button, Icon, Body, Title, Right } from 'native-base';
import StatusBarAndroid from '@/components/UI/StatusBarAndroid';
import styles from './styles';

function AuthHeader({ navigation, screenTitle, goBackRoute, hideBackButton }) {
  return (
    <Header
      noShadow
      style={styles.header}
      androidStatusBarColor="#000"
    >
      <StatusBarAndroid />
      <Left style={styles.headerLeft}>
        {
          hideBackButton ?
            null :
            <Button
              transparent
              onPress={
                goBackRoute ?
                  () => navigation.navigate(goBackRoute) :
                  () => navigation.goBack(null)
              }
            >
              <Icon
                name="arrow-back"
                style={styles.backButton}
              />
            </Button>
        }
      </Left>
      <Body style={styles.headerBody}>
        <Title style={styles.title}>{screenTitle}</Title>
      </Body>
      <Right style={styles.headerRight} />
    </Header>
  );
}

AuthHeader.propTypes = {
  navigation: PropTypes.object.isRequired,
  screenTitle: PropTypes.string.isRequired,
  goBackRoute: PropTypes.string,
  hideBackButton: PropTypes.bool,
};

export default withNavigation(AuthHeader);
