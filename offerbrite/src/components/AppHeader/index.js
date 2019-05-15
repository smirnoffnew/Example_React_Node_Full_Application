import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import { Header, Left, Button, Icon, Body, Title, Right } from 'native-base';
import styles from './styles';
import appTheme from '@/theme';

function AppHeader({ navigation, screenTitle, type, backRoute, componentRight }) {
  const headerLeft = type === 'empty' ?
    null :
    <Left style={styles.headerLeft}>
      <Button
        transparent
        onPress={
          backRoute ?
            () => navigation.navigate(backRoute) :
            () => navigation.goBack(null)
        }
      >
        <Icon
          name="arrow-back"
          style={styles.backButton}
        />
      </Button>
    </Left>;

  const headerRight = type === 'empty' ?
    null :
    <Right style={styles.headerRight}>
      {componentRight}
    </Right>;

  return (
    <Header
      noShadow
      style={styles.header}
      androidStatusBarColor={appTheme.dangerDark}
    >
      {headerLeft}
      <Body style={styles.headerBody}>
        <Title style={styles.title}>{screenTitle}</Title>
      </Body>
      {headerRight}
    </Header>
  );
}

AppHeader.propTypes = {
  navigation: PropTypes.object.isRequired,
  screenTitle: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'empty',
  ]),
  backRoute: PropTypes.string,
};

export default withNavigation(AppHeader);
