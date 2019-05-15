import React from 'react';
import PropTypes from 'prop-types';

import { View, Thumbnail } from 'native-base';
import styles from './styles';

export default function Logo({ color }) {
  return (
    <View style={styles.container}>
      <Thumbnail
        square
        source={
          color === 'white' ?
            require('../../../../assets/images/logo-white.png') :
            require('../../../../assets/images/logo-blue.png')
        }
        style={styles.logo}
      />
    </View>
  );
}

Logo.propTypes = {
  color: PropTypes.oneOf([
    'white',
    'blue',
  ]).isRequired,
};
