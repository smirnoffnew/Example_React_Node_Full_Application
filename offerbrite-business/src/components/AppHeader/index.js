import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import { Header, Left, Button, Icon, Body, Title, Right, Text, View } from 'native-base';
import StatusBarAndroid from '@/components/UI/StatusBarAndroid';
import styles from './styles';
import appTheme from '@/theme';

function AppHeader({ navigation, screenTitle, type, goBackRoute }) {
  let headerLeft, headerRight;

  if (type === 'full') {
    headerLeft = (
      <View style={{ flex: 1 }} />
    );

    headerRight = (
      <Button
        transparent
        onPress={() => navigation.navigate('OfferManagement', { action: 'create' })}
      >
        <Icon
          name="md-add"
          style={styles.addButton}
        />
      </Button>
    );
  } else if (type === 'withBackButton') {
    headerLeft = (
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
    );
  }

  return (
    <Header
      noShadow
      style={styles.header}
      androidStatusBarColor={appTheme.primaryDark}
    >
      <Left style={styles.headerLeft}>
        {headerLeft}
      </Left>
      <Body style={styles.headerBody}>
        <Title style={styles.title}>{screenTitle}</Title>
      </Body>
      <Right style={styles.headerRight}>
        {headerRight}
      </Right>
    </Header>
  );
}

AppHeader.propTypes = {
  navigation: PropTypes.object.isRequired,
  screenTitle: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'full',
    'empty',
    'withBackButton',
  ]).isRequired,
};

export default withNavigation(AppHeader);
